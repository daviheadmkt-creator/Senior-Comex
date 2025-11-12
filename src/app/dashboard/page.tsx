
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
import { AlertTriangle, FileWarning, CalendarClock, MoreHorizontal, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { differenceInDays, parseISO, format } from 'date-fns';

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

export default function DashboardPage() {
  const firestore = useFirestore();
  
  const processosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'processos'), where('status', 'not-in', ['Concluído', 'Cancelado']));
  }, [firestore]);

  const { data: processosAtivos, isLoading } = useCollection(processosQuery);
  
  const alerts = useMemo(() => {
    if (!processosAtivos) return [];

    const generatedAlerts: any[] = [];
    const today = new Date();

    processosAtivos.forEach(processo => {
      // Alerta de Processo Atrasado
      if (processo.status && processo.status.toLowerCase().includes('atrasado')) {
        generatedAlerts.push({
          id: `${processo.id}-atrasado`,
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
          message: `Processo ${processo.processo_interno || ''} com status 'Atrasado'.`,
          link: `/dashboard/processos/novo?id=${processo.id}&edit=true`,
        });
      }
      
      // Alerta de Processo Pendente (Aguardando)
      if (processo.status && processo.status.toLowerCase().includes('aguardando')) {
        generatedAlerts.push({
          id: `${processo.id}-pendente`,
          icon: <FileWarning className="h-5 w-5 text-orange-500" />,
          message: `Processo ${processo.processo_interno || ''} está pendente: ${processo.status}.`,
          link: `/dashboard/processos/novo?id=${processo.id}&edit=true`,
        });
      }


      // Alerta de Deadlines (Exemplo com deadline_draft)
      // Nota: Assumindo que o deadline é salvo como uma string ISO 8601 no Firestore
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
                <CardDescription>Uma visão geral dos seus embarques mais recentes e seus status.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>PO</TableHead>
                            <TableHead>Analista (Cliente)</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Navio</TableHead>
                            <TableHead>Origem / Destino</TableHead>
                            <TableHead>ETA</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Timeline</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                             <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && processosAtivos && processosAtivos.map((processo) => (
                            <TableRow key={processo.id}>
                                <TableCell className="font-medium">{processo.po_number}</TableCell>
                                <TableCell>{processo.analistaNome || 'N/A'} <br/> <span className='text-xs text-muted-foreground'>{processo.exportadorNome}</span></TableCell>
                                <TableCell>{processo.produtoNome}</TableCell>
                                <TableCell>{processo.navio}</TableCell>
                                <TableCell>{processo.portoEmbarqueNome} / {processo.portoDescargaNome}</TableCell>
                                <TableCell>{formatDate(processo.eta)}</TableCell>
                                <TableCell>{formatDate(processo.deadline_draft)}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(processo.status)}>{processo.status}</Badge>
                                </TableCell>
                                <TableCell>
                                     <Link href={`/dashboard/processos/novo?id=${processo.id}&edit=true`} passHref>
                                        <Button variant="outline" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                         {!isLoading && (!processosAtivos || processosAtivos.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    Nenhum processo ativo no momento.
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
                             <div className="flex items-center p-3 rounded-lg border hover:bg-accent cursor-pointer">
                                <div className="mr-4">
                                    {alert.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{alert.message}</p>
                                </div>
                                <Button variant="secondary" size="sm">Ver Processo</Button>
                            </div>
                        </Link>
                    ))}
                    {!isLoading && alerts.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                            Nenhum alerta no momento.
                        </div>
                    )}
                 </div>
            </CardContent>
        </Card>
    </div>
  );
}
