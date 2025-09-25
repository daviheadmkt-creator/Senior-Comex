
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from 'recharts';
import { RefreshCw, Ship, Plane, Truck, AlertTriangle, CheckCircle, PackageSearch, FileWarning, CalendarClock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const volumeData = [
  { time: '09:00', volume: 12000 },
  { time: '10:00', volume: 15000 },
  { time: '11:00', volume: 13000 },
  { time: '12:00', volume: 18000 },
  { time: '13:00', volume: 21000 },
  { time: '14:00', volume: 25000 },
  { time: '15:00', volume: 23000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const alerts = [
    { id: 1, icon: <CalendarClock className="h-5 w-5 text-yellow-600" />, message: "Deadline de Draft para o processo SEN2378-26 se aproxima (2 dias).", link: "/dashboard/processos" },
    { id: 2, icon: <FileWarning className="h-5 w-5 text-orange-500" />, message: "Faltando Packing List para o processo SEN2378-26.", link: "/dashboard/processos" },
    { id: 3, icon: <AlertTriangle className="h-5 w-5 text-red-600" />, message: "Processo SEN2378-28 com status 'Atrasado'.", link: "/dashboard/processos" },
]


export default function DashboardPage() {
    const [processos, setProcessos] = useState<any[]>([]);

    useEffect(() => {
        const storedProcessos = localStorage.getItem('processos');
        if (storedProcessos) {
            setProcessos(JSON.parse(storedProcessos));
        }
    }, []);

    const totalOperacoes = processos.length;
    const alertasAtuais = processos.filter(p => p.status === 'Atrasado').length;
    const concluidosMes = processos.filter(p => p.status === 'Concluído').length; 

    const statusData = processos.reduce((acc, processo) => {
        const status = processo.status;
        const existingStatus = acc.find(item => item.name === status);
        if (existingStatus) {
            existingStatus.value += 1;
        } else {
            acc.push({ name: status, value: 1 });
        }
        return acc;
    }, [] as { name: string; value: number }[]);


  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard em Tempo Real</h1>
                <p className="text-muted-foreground">Última atualização: agora mesmo</p>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Operações Ativas</CardTitle>
                    <PackageSearch className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOperacoes}</div>
                    <p className="text-xs text-muted-foreground">Total de processos cadastrados</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor em Trânsito (BRL)</CardTitle>
                    <Ship className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">R$ 1.250.340,00</div>
                    <p className="text-xs text-muted-foreground">Valor estático (exemplo)</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Alertas Atuais</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${alertasAtuais > 0 ? 'text-destructive' : ''}`}>{alertasAtuais}</div>
                    <p className="text-xs text-muted-foreground">Processos com status 'Atrasado'</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Processos Concluídos (Mês)</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{concluidosMes}</div>
                    <p className="text-xs text-muted-foreground">Total de processos concluídos</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Volume de Exportação (Hoje)</CardTitle>
                    <CardDescription>Valor total (BRL) dos produtos embarcados por hora.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={volumeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${Number(value) / 1000}k`} />
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                            <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4}} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Status dos Processos</CardTitle>
                    <CardDescription>Distribuição de todas as operações ativas.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={statusData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" >
                                {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                            <Legend iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
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
