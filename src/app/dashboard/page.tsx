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
                message: `ATRASADO: Deadline de ${dl.label} para o processo ${processo.processo_interno || ''} expirou em ${format(deadlineDate, 'dd/MM/yyyy HH:mm')}.`,
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
    </div>
  );
}
