
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileWarning, CalendarClock, MoreHorizontal, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

const alerts = [
    { id: 1, icon: <CalendarClock className="h-5 w-5 text-yellow-600" />, message: "Deadline de Draft para o processo SEN2378-26 se aproxima (2 dias).", link: "/dashboard/processos" },
    { id: 2, icon: <FileWarning className="h-5 w-5 text-orange-500" />, message: "Faltando Packing List para o processo SEN2378-26.", link: "/dashboard/processos" },
    { id: 3, icon: <AlertTriangle className="h-5 w-5 text-red-600" />, message: "Processo SEN2378-28 com status 'Atrasado'.", link: "/dashboard/processos" },
]

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return 'outline';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('trânsito') || lowerStatus.includes('confirmado') || lowerStatus.includes('aprovados') || lowerStatus.includes('desembaraçada') || lowerStatus.includes('deferido') || lowerStatus.includes('realizada')) return 'default';
    if (lowerStatus.includes('concluído') || lowerStatus.includes('pronto')) return 'outline';
    if (lowerStatus.includes('aguardando') || lowerStatus.includes('iniciado')) return 'secondary';
    if (lowerStatus.includes('atrasado') || lowerStatus.includes('cancelado') || lowerStatus.includes('correcao')) return 'destructive';
    return 'outline';
};

export default function DashboardPage() {
  const firestore = useFirestore();
  
  const processosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'processos'), where('status', '!=', 'Concluído'), where('status', '!=', 'Cancelado'));
  }, [firestore]);

  const { data: processosAtivos, isLoading } = useCollection(processosQuery);

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
                            <TableHead>Cliente</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Navio</TableHead>
                            <TableHead>Destino</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                             <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && processosAtivos && processosAtivos.map((processo) => (
                            <TableRow key={processo.id}>
                                <TableCell className="font-medium">{processo.po_number}</TableCell>
                                <TableCell>{processo.exportadorNome}</TableCell>
                                <TableCell>{processo.produtoNome}</TableCell>
                                <TableCell>{processo.navio}</TableCell>
                                <TableCell>{processo.destino}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(processo.status)}>{processo.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                         {!isLoading && (!processosAtivos || processosAtivos.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
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
                    {alerts.map(alert => (
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
                    {alerts.length === 0 && (
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
