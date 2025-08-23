
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
import { RefreshCw, Ship, Plane, Truck, AlertTriangle, CheckCircle, PackageSearch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const volumeData = [
  { time: '09:00', volume: 12000 },
  { time: '10:00', volume: 15000 },
  { time: '11:00', volume: 13000 },
  { time: '12:00', volume: 18000 },
  { time: '13:00', volume: 21000 },
  { time: '14:00', volume: 25000 },
  { time: '15:00', volume: 23000 },
];

const statusData = [
  { name: 'Em Trânsito', value: 45 },
  { name: 'Aguardando Desembaraço', value: 15 },
  { name: 'Em Produção', value: 25 },
  { name: 'Aguardando Embarque', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const recentActivities = [
    { id: 'PED-003', status: 'Embarcado', location: 'Porto de Santos', time: 'Há 5 minutos'},
    { id: 'PED-004', status: 'Desembaraço Iniciado', location: 'Alfândega de NY', time: 'Há 15 minutos'},
    { id: 'PED-002', status: 'Chegada ao Destino', location: 'Port of New York', time: 'Há 1 hora'},
];


export default function DashboardPage() {
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard em Tempo Real</h1>
                <p className="text-muted-foreground">Última atualização: agora mesmo</p>
            </div>
            <Button variant="outline">
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
                    <div className="text-2xl font-bold">85</div>
                    <p className="text-xs text-muted-foreground">+3 nas últimas 24h</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor em Trânsito (USD)</CardTitle>
                    <Ship className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$1,250,340.00</div>
                    <p className="text-xs text-muted-foreground">45 embarques marítimos</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Alertas Atuais</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">3</div>
                    <p className="text-xs text-muted-foreground">2 atrasos, 1 doc pendente</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Embarques Concluídos (Mês)</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">124</div>
                    <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Volume de Exportação (Hoje)</CardTitle>
                    <CardDescription>Valor total (USD) dos produtos embarcados por hora.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={volumeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                            <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4}} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Status dos Embarques</CardTitle>
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
                <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Processo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Localização</TableHead>
                            <TableHead>Horário</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {recentActivities.map((activity) => (
                         <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.id}</TableCell>
                            <TableCell><Badge variant="outline">{activity.status}</Badge></TableCell>
                            <TableCell>{activity.location}</TableCell>
                            <TableCell className="text-muted-foreground">{activity.time}</TableCell>
                        </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
