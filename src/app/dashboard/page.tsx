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
import { AlertTriangle, FileWarning, CalendarClock, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { differenceInDays, parseISO, isAfter, format } from 'date-fns';
import { cn } from '@/lib/utils';

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '---';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy');
  } catch {
    return '---';
  }
};

const ProcessoSpreadsheet = ({ processos }: { processos: any[] }) => {
  if (!processos || processos.length === 0) return null;

  return (
    <Card className="mt-6 overflow-hidden border-primary/30">
      <CardHeader className="bg-primary text-primary-foreground py-4">
        <CardTitle className="text-lg">Painel de Controle Operacional</CardTitle>
        <CardDescription className="text-primary-foreground/70">Visão consolidada de marcos, documentos e conformidade fiscal.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-primary/20 text-[10px]">
            <thead>
              <tr className="bg-primary text-primary-foreground text-center h-12">
                <th className="border border-primary-foreground/20 px-2 min-w-[110px]">DEAD LINE</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[130px]">STATUS</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[160px]">DADOS CONTAINERS<br/>NOTAS REMESSA<br/>NOTAS EXPORTAÇÃO</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[160px]">LPCO<br/>INSPEÇÃO (MAPA)<br/>TRATAMENTO(FUMIGAÇÃO)</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[160px]">DUE<br/>DESEMBARAÇO<br/>AVERBAÇÃO</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[100px]">BL</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[100px]">CERTIFICADO<br/>ORIGEM</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[100px]">CERTIFICADO<br/>FITO</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[100px]">LAUDO<br/>PRAGAS</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[100px]">CERTIFICADO<br/>FUMIGAÇÃO</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[100px]">CERTIFICADO<br/>SUPERVISORA</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[100px]">INVOICE<br/>(FERRARI)</th>
                <th className="border border-primary-foreground/20 px-2 min-w-[100px]">PACKING LIST<br/>(FERRARI)</th>
              </tr>
            </thead>
            <tbody>
              {processos.map((processo) => {
                const getDocStatus = (name: string) => {
                  const doc = processo.documentos_pos_embarque?.find((d: any) => d.nome === name);
                  return {
                    status: doc ? 'APROVADO' : '---',
                    action: doc ? (name === 'BL' ? 'LIBERADO/TELEX' : 'RECEBIO EM') : '---',
                    date: doc?.data_liberacao ? formatDate(doc.data_liberacao) : '---'
                  };
                };

                const getNFDate = (type: string) => {
                  const nf = processo.notas_fiscais?.find((n: any) => n.tipo === type);
                  return nf?.data_recebida ? formatDate(nf.data_recebida) : '---';
                };

                const bl = getDocStatus('BL');
                const origem = getDocStatus('ORIGEM');
                const fito = getDocStatus('FITO');
                const pragas = getDocStatus('HEALTH');
                const fumigacao = getDocStatus('FUMIGATION');
                const supervisora = getDocStatus('QUALITY');
                const invoice = getDocStatus('INVOICE');
                const packing = getDocStatus('PACKING LIST');

                return (
                  <tr key={processo.id} className="bg-background text-primary font-bold border-b border-primary/10 hover:bg-accent/5 transition-colors">
                    {/* DEAD LINE */}
                    <td className="border-r border-primary/10 p-0">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="flex justify-between px-2 py-1.5 italic"><span>DRAFT</span> <span className="text-destructive font-bold ml-2">{formatDate(processo.deadline_draft)}</span></div>
                        <div className="flex justify-between px-2 py-1.5 italic"><span>VGM</span> <span className="text-destructive font-bold ml-2">{formatDate(processo.deadline_vgm)}</span></div>
                        <div className="flex justify-between px-2 py-1.5 italic"><span>CARGA</span> <span className="text-destructive font-bold ml-2">{formatDate(processo.deadline_carga)}</span></div>
                      </div>
                    </td>
                    {/* STATUS */}
                    <td className="border-r border-primary/10 px-2 py-1 text-center font-bold uppercase align-middle bg-accent/10 min-h-[60px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-primary/60 font-medium">{processo.processo_interno}</span>
                        {processo.status}
                      </div>
                    </td>
                    {/* DADOS CONTAINERS / NOTAS */}
                    <td className="border-r border-primary/10 p-0">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="flex justify-between px-2 py-1.5 italic"><span>CONTAINERS</span> <span className="text-destructive font-bold ml-2">{processo.containers?.length > 0 ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                        <div className="flex justify-between px-2 py-1.5 italic"><span>REMESSA</span> <span className="text-destructive font-bold ml-2">{getNFDate('Remessa')}</span></div>
                        <div className="flex justify-between px-2 py-1.5 italic"><span>EXPORTAÇÃO</span> <span className="text-destructive font-bold ml-2">{getNFDate('Exportação')}</span></div>
                      </div>
                    </td>
                    {/* LPCO / INSPEÇÃO / TRATAMENTO */}
                    <td className="border-r border-primary/10 p-0">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="flex justify-between px-2 py-1.5 italic"><span>LPCO</span> <span className="text-muted-foreground font-bold ml-2">{processo.lpco_protocolo || '---'}</span></div>
                        <div className="flex justify-between px-2 py-1.5 italic"><span>INSPEÇÃO</span> <span className="text-destructive font-bold ml-2">{processo.mapa_status?.includes('DEFERIDA') ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                        <div className="flex justify-between px-2 py-1.5 italic"><span>TRATAMENTO</span> <span className="text-destructive font-bold ml-2">{fumigacao.date}</span></div>
                      </div>
                    </td>
                    {/* DUE / DESEMBARAÇO / AVERBAÇÃO */}
                    <td className="border-r border-primary/10 p-0">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="flex justify-between px-2 py-1.5 italic"><span>DUE</span> <span className="text-muted-foreground font-bold ml-2 truncate max-w-[80px]">{processo.due_numero || '---'}</span></div>
                        <div className="flex justify-between px-2 py-1.5 italic"><span>DESEMBARAÇO</span> <span className="text-destructive font-bold ml-2">{processo.due_status?.includes('DESEMBARAÇADA') ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                        <div className="flex justify-between px-2 py-1.5 italic"><span>AVERBADA</span> <span className="text-destructive font-bold ml-2">{processo.due_status === 'AVERBADA' ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                      </div>
                    </td>
                    {/* BL */}
                    <td className="border-r border-primary/10 p-0 text-center">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="py-1.5 uppercase text-primary font-bold">{bl.status}</div>
                        <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{bl.action}</div>
                        <div className="py-1.5 text-destructive font-bold">{bl.date}</div>
                      </div>
                    </td>
                    {/* CERT ORIGEM */}
                    <td className="border-r border-primary/10 p-0 text-center">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="py-1.5 uppercase text-primary font-bold">{origem.status}</div>
                        <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{origem.action}</div>
                        <div className="py-1.5 text-destructive font-bold">{origem.date}</div>
                      </div>
                    </td>
                    {/* CERT FITO */}
                    <td className="border-r border-primary/10 p-0 text-center">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="py-1.5 uppercase text-primary font-bold">{fito.status}</div>
                        <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{fito.action}</div>
                        <div className="py-1.5 text-destructive font-bold">{fito.date}</div>
                      </div>
                    </td>
                    {/* LAUDO PRAGAS */}
                    <td className="border-r border-primary/10 p-0 text-center">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="py-1.5 uppercase text-primary font-bold">{pragas.status}</div>
                        <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{pragas.action}</div>
                        <div className="py-1.5 text-destructive font-bold">{pragas.date}</div>
                      </div>
                    </td>
                    {/* CERT FUMIGACAO */}
                    <td className="border-r border-primary/10 p-0 text-center">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="py-1.5 uppercase text-primary font-bold">{fumigacao.status}</div>
                        <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{fumigacao.action}</div>
                        <div className="py-1.5 text-destructive font-bold">{fumigacao.date}</div>
                      </div>
                    </td>
                    {/* CERT SUPERVISORA */}
                    <td className="border-r border-primary/10 p-0 text-center">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="py-1.5 uppercase text-primary font-bold">{supervisora.status}</div>
                        <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{supervisora.action}</div>
                        <div className="py-1.5 text-destructive font-bold">{supervisora.date}</div>
                      </div>
                    </td>
                    {/* INVOICE */}
                    <td className="border-r border-primary/10 p-0 text-center">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="py-1.5 uppercase text-primary font-bold">{invoice.status}</div>
                        <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{invoice.action}</div>
                        <div className="py-1.5 text-destructive font-bold">{invoice.date}</div>
                      </div>
                    </td>
                    {/* PACKING LIST */}
                    <td className="p-0 text-center">
                      <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                        <div className="py-1.5 uppercase text-primary font-bold">{packing.status}</div>
                        <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{packing.action}</div>
                        <div className="py-1.5 text-destructive font-bold">{packing.date}</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

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
    const now = new Date();

    processosAtivos.forEach(processo => {
      if (processo.status && processo.status.toLowerCase().includes('atrasado')) {
        generatedAlerts.push({
          id: `${processo.id}-atrasado-status`,
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
          message: `Processo ${processo.processo_interno || ''} com status 'Atrasado'.`,
          link: `/dashboard/processos/novo?id=${processo.id}&edit=true`,
          borderColor: 'border-l-red-600'
        });
      }
      
      if (processo.status && (processo.status.toLowerCase().includes('aguardando') || processo.status.toLowerCase().includes('correcao'))) {
        generatedAlerts.push({
          id: `${processo.id}-pendente`,
          icon: <FileWarning className="h-5 w-5 text-orange-500" />,
          message: `Processo ${processo.processo_interno || ''} está pendente: ${processo.status}.`,
          link: `/dashboard/processos/novo?id=${processo.id}&edit=true`,
          borderColor: 'border-l-orange-500'
        });
      }

      const deadlines = [
        { key: 'deadline_draft', label: 'Draft' },
        { key: 'deadline_vgm', label: 'VGM' },
        { key: 'deadline_carga', label: 'Carga' }
      ];

      deadlines.forEach(dl => {
        const dateStr = processo[dl.key];
        if (dateStr) {
          try {
            const deadlineDate = parseISO(dateStr);
            if (isAfter(now, deadlineDate)) {
              generatedAlerts.push({
                id: `${processo.id}-${dl.key}-overdue`,
                icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
                message: `Deadline de ${dl.label} ATRASADO para o processo ${processo.processo_interno || ''}.`,
                link: `/dashboard/processos/novo?id=${processo.id}&edit=true`,
                borderColor: 'border-l-red-600'
              });
            } 
            else {
              const daysRemaining = differenceInDays(deadlineDate, now);
              if (daysRemaining >= 0 && daysRemaining <= 3) {
                generatedAlerts.push({
                  id: `${processo.id}-${dl.key}-upcoming`,
                  icon: <CalendarClock className="h-5 w-5 text-yellow-600" />,
                  message: `Deadline de ${dl.label} para o processo ${processo.processo_interno || ''} se aproxima (${daysRemaining + 1} dias).`,
                  link: `/dashboard/processos/novo?id=${processo.id}&edit=true`,
                  borderColor: 'border-l-yellow-500'
                });
              }
            }
          } catch(e) {}
        }
      });
    });

    return generatedAlerts;
  }, [processosAtivos]);


  return (
    <div className="space-y-6">
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
                             <div className={cn(
                               "flex items-center p-3 rounded-lg border border-l-4 hover:bg-accent cursor-pointer transition-all shadow-sm",
                               alert.borderColor || "border-l-primary"
                             )}>
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

        {!isLoading && processosAtivos && processosAtivos.length > 0 && (
          <ProcessoSpreadsheet processos={processosAtivos} />
        )}
    </div>
  );
}
