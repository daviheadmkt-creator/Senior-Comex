
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Gauge, Search, FileDown, TrendingUp, TrendingDown, Clock, DollarSign, PackageCheck, FileWarning, Ship, Plane } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


const kpiData = {
    avgClearanceTime: { value: '2.5 dias', change: '-10%', trend: 'down' },
    avgCostPerOperation: { value: 'R$ 3.850,00', change: '+2%', trend: 'up' },
    onTimeDeliveryRate: { value: '96%', change: '+1.5%', trend: 'up' },
    documentAccuracy: { value: '98%', change: '-0.5%', trend: 'down' },
    maritimeVolume: { value: '120 TEUs', change: '+5%', trend: 'up' },
    airVolume: { value: '15 TON', change: '-3%', trend: 'down' },
};

const clearanceTimeData = [
  { month: 'Jan', days: 3.1 },
  { month: 'Fev', days: 2.9 },
  { month: 'Mar', days: 3.0 },
  { month: 'Abr', days: 2.7 },
  { month: 'Mai', days: 2.5 },
  { month: 'Jun', days: 2.6 },
];

const costPerOpData = [
  { month: 'Jan', cost: 3600 },
  { month: 'Fev', cost: 3750 },
  { month: 'Mar', cost: 3700 },
  { month: 'Abr', cost: 3800 },
  { month: 'Mai', cost: 3850 },
  { month: 'Jun', cost: 3900 },
];

const TrendArrow = ({ trend }: { trend: 'up' | 'down' }) => {
    if (trend === 'up') {
        return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />;
}

export default function IndicadoresPerformancePage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
           <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-md">
                <Gauge className="h-6 w-6" />
            </div>
            <div>
                <CardTitle>Indicadores de Performance (KPIs)</CardTitle>
                <CardDescription>
                Filtre para analisar os principais indicadores de seus processos de exportação.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                    <Label htmlFor="date-from">Período De</Label>
                    <Input id="date-from" type="date" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="date-to">Até</Label>
                    <Input id="date-to" type="date" />
                </div>
                <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button className="w-full">
                        <Search className="mr-2 h-4 w-4" />
                        Analisar Período
                    </Button>
                </div>
            </div>
        </CardContent>
       </Card>

       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Tempo Médio de Desembaraço</CardTitle>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{kpiData.avgClearanceTime.value}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendArrow trend={kpiData.avgClearanceTime.trend} />
                        <span>{kpiData.avgClearanceTime.change} em relação ao período anterior (Melhor)</span>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Custo Médio por Operação</CardTitle>
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{kpiData.avgCostPerOperation.value}</p>
                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendArrow trend={kpiData.avgCostPerOperation.trend} />
                        <span>{kpiData.avgCostPerOperation.change} em relação ao período anterior</span>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Entregas no Prazo</CardTitle>
                    <PackageCheck className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{kpiData.onTimeDeliveryRate.value}</p>
                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendArrow trend={kpiData.onTimeDeliveryRate.trend} />
                        <span>{kpiData.onTimeDeliveryRate.change} em relação ao período anterior</span>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Acuracidade dos Documentos</CardTitle>
                    <FileWarning className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{kpiData.documentAccuracy.value}</p>
                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendArrow trend={kpiData.documentAccuracy.trend} />
                        <span>{kpiData.documentAccuracy.change} em relação ao período anterior</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Volume Exportado (Marítimo)</CardTitle>
                    <Ship className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{kpiData.maritimeVolume.value}</p>
                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendArrow trend={kpiData.maritimeVolume.trend} />
                        <span>{kpiData.maritimeVolume.change} em relação ao período anterior</span>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Volume Exportado (Aéreo)</CardTitle>
                    <Plane className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{kpiData.airVolume.value}</p>
                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendArrow trend={kpiData.airVolume.trend} />
                        <span>{kpiData.airVolume.change} em relação ao período anterior</span>
                    </div>
                </CardContent>
            </Card>
       </div>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Tendência do Tempo de Desembaraço</CardTitle>
                    <CardDescription>Média de dias para liberação da carga nos últimos 6 meses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={clearanceTimeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} unit="d" />
                            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                            <Line type="monotone" dataKey="days" name="Dias" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Tendência do Custo por Operação</CardTitle>
                    <CardDescription>Valor médio (R$) por processo nos últimos 6 meses.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={costPerOpData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                            <Tooltip cursor={{fill: 'hsla(var(--muted-foreground), 0.1)'}} contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                            <Bar dataKey="cost" name="Custo" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
