
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileWarning, CalendarClock, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const alerts = [
    { id: 1, icon: <CalendarClock className="h-5 w-5 text-yellow-600" />, message: "Deadline de Draft para o processo SEN2378-26 se aproxima (2 dias).", link: "/dashboard/processos" },
    { id: 2, icon: <FileWarning className="h-5 w-5 text-orange-500" />, message: "Faltando Packing List para o processo SEN2378-26.", link: "/dashboard/processos" },
    { id: 3, icon: <AlertTriangle className="h-5 w-5 text-red-600" />, message: "Processo SEN2378-28 com status 'Atrasado'.", link: "/dashboard/processos" },
]

const processosAtivos = [
    {
        po: '3426B',
        analista: 'Ana Silva',
        cliente: 'Agrícola Exemplo',
        produto: 'Soja em Grãos',
        navio: 'MSC CARMEN',
        origem: 'Santos',
        destino: 'Xangai',
        eta: '08/09/2024',
        deadline: '31/07/2024',
        status: 'Em trânsito',
    },
    {
        po: '3427A',
        analista: 'Carlos Dias',
        cliente: 'Grãos Brasil S.A.',
        produto: 'Milho em Grãos',
        navio: 'MAERSK LINE',
        origem: 'Paranaguá',
        destino: 'Roterdã',
        eta: '15/08/2024',
        deadline: '05/08/2024',
        status: 'Aguardando embarque',
    },
    {
        po: '3428C',
        analista: 'Daniela Lima',
        cliente: 'Produtores Associados',
        produto: 'Gergelim Branco',
        navio: 'HAPAG-LLOYD',
        origem: 'Santos',
        destino: 'Dubai',
        eta: '10/08/2024',
        deadline: '25/07/2024',
        status: 'Atrasado',
    }
];

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return 'outline';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('em trânsito')) return 'default';
    if (lowerStatus.includes('concluído')) return 'default';
    if (lowerStatus.includes('aguardando')) return 'secondary';
    if (lowerStatus.includes('atrasado')) return 'destructive';
    return 'outline';
};

export default function DashboardPage() {

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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {processosAtivos.map((processo) => (
                            <TableRow key={processo.po}>
                                <TableCell className="font-medium">{processo.po}</TableCell>
                                <TableCell>
                                    <div>{processo.analista}</div>
                                    <div className="text-xs text-muted-foreground">{processo.cliente}</div>
                                </TableCell>
                                <TableCell>{processo.produto}</TableCell>
                                <TableCell>{processo.navio}</TableCell>
                                <TableCell>{processo.origem} / {processo.destino}</TableCell>
                                <TableCell>{processo.eta}</TableCell>
                                <TableCell>{processo.deadline}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(processo.status)}>{processo.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
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
