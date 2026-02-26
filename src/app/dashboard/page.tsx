'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileWarning, CalendarClock, Loader2, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { differenceInDays, parseISO, format } from 'date-fns';
import { useSearch } from '@/components/search-provider';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const processStatusOptions = [
  "Iniciado / Aguardando Booking",
  "Booking Confirmado / Aguardando Draft",
  "DRAFTS_EM_APROVAÇÃO",
  "DRAFTS_APROVADOS",
  "CORRECAO_DE_DRAFT_SOLICITADA",
  "CARGA_EM_TRANSITO_PARA_ESTUFAGEM",
  "AGUARDANDO_EMISSAO_NF_EXPORTACAO",
  "DUE_DESEMBARACADA",
  "DOSSIÊ_SUBMETIDO / AGUARDANDO_ANÁLISE_FISCAL",
  "INSPECAO_MAPA_AGENDADA",
  "INSPECAO_MAPA_REALIZADA / AGUARDANDO_RELACRE",
  "PRONTO_PARA_EMBARQUE",
  "Em trânsito",
  "DOCUMENTOS_ORIGINAIS_COLETADOS / AGUARDANDO_ENVIO",
  "Concluído",
  "Cancelado",
];

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return 'outline';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('trânsito') || lowerStatus.includes('confirmado') || lowerStatus.includes('aprovados') || lowerStatus.includes('desembaraçada') || lowerStatus.includes('deferido') || lowerStatus.includes('realizada')) return 'default';
    if (lowerStatus.includes('concluído') || lowerStatus.includes('pronto')) return 'outline';
    if (lowerStatus.includes('aguardando') || lowerStatus.includes('iniciado')) return 'secondary';
    if (lowerStatus.includes('atrasado') || lowerStatus.includes('cancelado') || lowerStatus.includes('correcao')) return 'destructive';
    return 'outline';
};

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
        return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
        return 'Data Inválida';
    }
}

const getStageColor = (processo: any, stage: number) => {
    const status = processo.status || '';
    const statusNumber = processStatusOptions.indexOf(status);
    
    switch (stage) {
        case 1: // Booking
            return statusNumber >= 1 ? 'bg-green-500' : 'bg-muted';
        case 2: // Drafts
            if (statusNumber >= 3) return 'bg-green-500';
            if (status === 'CORRECAO_DE_DRAFT_SOLICITADA') return 'bg-destructive animate-pulse';
            if (statusNumber >= 1) return 'bg-yellow-500';
            return 'bg-muted';
        case 3: // Liberação
            const isDueOk = processo.due_status === 'DESEMABRAÇADA' || processo.due_status === 'AVERBADA' || processo.due_status === 'DESEMBARAÇADA';
            const isMapaOk = processo.mapa_status === 'DEFERIDA' || processo.mapa_status === 'DEFERIDA/CERTIFICADO EMITIDO';
            if (isDueOk && isMapaOk) return 'bg-green-500';
            if (statusNumber >= 3) return 'bg-yellow-500';
            return 'bg-muted';
        case 4: // Embarque
            if (processo.navio_final || status.toLowerCase().includes('trânsito') || status.toLowerCase().includes('concluído')) return 'bg-green-500';
            if (statusNumber >= 11) return 'bg-yellow-500';
            return 'bg-muted';
        case 5: // Documentação
            if (processo.documentos_pos_embarque?.some((d: any) => d.nome === 'BL')) return 'bg-green-500';
            if (statusNumber >= 12) return 'bg-yellow-500';
            return 'bg-muted';
        case 6: // Conclusão
            if (status === "Concluído") return 'bg-green-500';
            if (processo.awb_courier) return 'bg-yellow-500';
            return 'bg-muted';
        default: return 'bg-muted';
    }
}

const ProcessStages = ({ processo }: { processo: any }) => {
    const stages = [1, 2, 3, 4, 5, 6];
    const stageNames = [
        "Etapa 1: Booking",
        "Etapa 2: Drafts",
        "Etapa 3: Liberação",
        "Etapa 4: Embarque",
        "Etapa 5: Documentação",
        "Etapa 6: Conclusão"
    ];

    return (
        <div className="flex gap-1 items-center">
            {stages.map((stage, i) => (
                <TooltipProvider key={stage}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className={cn("h-2.5 w-3 rounded-sm transition-colors", getStageColor(processo, stage))} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs font-semibold">{stageNames[i]}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    );
}

export default function DashboardPage() {
  const firestore = useFirestore();
  const { searchTerm } = useSearch();
  
  const processosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'processos'), where('status', 'not-in', ['Concluído', 'Cancelado']));
  }, [firestore]);

  const { data: processosAtivos, isLoading } = useCollection(processosQuery);
  
  const filteredProcessos = useMemo(() => {
    if (!processosAtivos) return [];
    const term = searchTerm.toLowerCase();
    return processosAtivos.filter(p => 
      (p.po_number || '').toLowerCase().includes(term) ||
      (p.produtoNome || '').toLowerCase().includes(term) ||
      (p.processo_interno || '').toLowerCase().includes(term) ||
      (p.navio || '').toLowerCase().includes(term) ||
      (p.exportadorNome || '').toLowerCase().includes(term)
    );
  }, [processosAtivos, searchTerm]);

  const alerts = useMemo(() => {
    if (!processosAtivos) return [];

    const generatedAlerts: any[] = [];
    const today = new Date();

    processosAtivos.forEach(processo => {
      if (processo.status && processo.status.toLowerCase().includes('atrasado')) {
        generatedAlerts.push({
          id: `${processo.id}-atrasado`,
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
          message: `Processo ${processo.processo_interno || ''} com status 'Atrasado'.`,
          link: `/dashboard/processos/novo?id=${processo.id}&edit=true`,
        });
      }
      
      if (processo.status && processo.status.toLowerCase().includes('aguardando')) {
        generatedAlerts.push({
          id: `${processo.id}-pendente`,
          icon: <FileWarning className="h-5 w-5 text-orange-500" />,
          message: `Processo ${processo.processo_interno || ''} está pendente: ${processo.status}.`,
          link: `/dashboard/processos/novo?id=${processo.id}&edit=true`,
        });
      }

      if (processo.deadline_draft) {
        try {
            const deadlineDate = parseISO(processo.deadline_draft);
            const daysRemaining = differenceInDays(deadlineDate, today);
            
            if (daysRemaining >= 0 && daysRemaining <= 3) {
              generatedAlerts.push({
                id: `${processo.id}-deadline`,
                icon: <CalendarClock className="h-5 w-5 text-yellow-600" />,
                message: `Deadline de Draft para o processo ${processo.processo_interno || ''} se aproxima (${daysRemaining + 1} dias).`,
                link: `/dashboard/processos/novo?id=${processo.id}&edit=true`,
              });
            }
        } catch(e) {
             console.error("Invalid date format for deadline_draft:", processo.deadline_draft);
        }
      }
    });

    return generatedAlerts;
  }, [processosAtivos]);


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Processos Ativos em Tempo Real</CardTitle>
                <CardDescription>Acompanhe o status e o progresso de cada etapa dos seus embarques.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">PO / Processo</TableHead>
                            <TableHead>Analista (Cliente)</TableHead>
                            <TableHead className="hidden sm:table-cell">Produto</TableHead>
                            <TableHead className="hidden lg:table-cell">Navio</TableHead>
                            <TableHead className="hidden xl:table-cell">Origem / Destino</TableHead>
                            <TableHead>Progresso</TableHead>
                            <TableHead>Status Atual</TableHead>
                            <TableHead className="hidden md:table-cell">Navio / ETA</TableHead>
                            <TableHead className="text-right">Ação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                             <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && filteredProcessos && filteredProcessos.map((processo) => (
                            <TableRow key={processo.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="font-bold">
                                    {processo.po_number}
                                    <br />
                                    <span className="text-[10px] text-muted-foreground font-normal">{processo.processo_interno}</span>
                                </TableCell>
                                <TableCell className="text-xs">
                                    <span className="font-semibold">{processo.analistaNome || 'N/A'}</span>
                                    <br/>
                                    <span className='text-[10px] text-muted-foreground uppercase'>{processo.exportadorNome}</span>
                                </TableCell>
                                <TableCell className="text-xs font-medium hidden sm:table-cell">{processo.produtoNome}</TableCell>
                                <TableCell className="text-xs hidden lg:table-cell">{processo.navio}</TableCell>
                                <TableCell className="text-xs hidden xl:table-cell">
                                    <span className="text-muted-foreground">{processo.portoEmbarqueNome}</span>
                                    <br />
                                    <span className="font-medium text-primary">→ {processo.portoDescargaNome}</span>
                                </TableCell>
                                <TableCell>
                                    <ProcessStages processo={processo} />
                                </TableCell>
                                <TableCell>
                                    <Badge 
                                        variant={getStatusVariant(processo.status)} 
                                        className="text-xs px-2 py-0.5 whitespace-nowrap"
                                    >
                                        {processo.status || 'Sem Status'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-[11px] font-mono hidden md:table-cell">
                                    <span className="font-bold text-foreground block truncate max-w-[120px]" title={processo.navio}>{processo.navio || 'N/A'}</span>
                                    {formatDate(processo.eta)}
                                </TableCell>
                                <TableCell className="text-right">
                                     <Link href={`/dashboard/processos/novo?id=${processo.id}&edit=true`} passHref>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary hover:text-primary-foreground">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                         {!isLoading && (!filteredProcessos || filteredProcessos.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground italic">
                                    Nenhum processo ativo corresponde à sua busca.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Alertas e Pendências</CardTitle>
                 <CardDescription>Ações e prazos que requerem sua atenção imediata.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    {isLoading && (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    {!isLoading && alerts.map(alert => (
                        <Link href={alert.link} key={alert.id} passHref>
                             <div className="flex items-center p-3 rounded-lg border border-l-4 border-l-primary hover:bg-accent cursor-pointer transition-all shadow-sm">
                                <div className="mr-4">
                                    {alert.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{alert.message}</p>
                                </div>
                                <Button variant="outline" size="sm">Ver Detalhes</Button>
                            </div>
                        </Link>
                    ))}
                    {!isLoading && alerts.length === 0 && (
                        <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-50" />
                            <p>Tudo em dia! Nenhum alerta no momento.</p>
                        </div>
                    )}
                 </div>
            </CardContent>
        </Card>
    </div>
  );
}
