
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter
} from '@/components/ui/table';
import { ArrowDownCircle, ArrowLeftRight, ArrowUpCircle, Search, DollarSign } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const cashFlowData = [
  { month: 'Jan', entradas: 4000, saidas: 2400 },
  { month: 'Fev', entradas: 3000, saidas: 1398 },
  { month: 'Mar', entradas: 2000, saidas: 9800 },
  { month: 'Abr', entradas: 2780, saidas: 3908 },
  { month: 'Mai', entradas: 1890, saidas: 4800 },
  { month: 'Jun', entradas: 2390, saidas: 3800 },
];

const recentTransactions = [
    { type: 'entrada', description: 'Recebimento Fatura CI-2024-001', value: 21800.00, date: '22/07/2024'},
    { type: 'saida', description: 'Pagamento Frete FRT-001', value: -1500.00, date: '21/07/2024'},
    { type: 'saida', description: 'Pagamento Despachante DA-455', value: -850.00, date: '20/07/2024'},
    { type: 'entrada', description: 'Adiantamento Pedido PED-002', value: 5400.00, date: '19/07/2024'},
];


export default function FluxoDeCaixaPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
           <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-md">
                <ArrowLeftRight className="h-6 w-6" />
            </div>
            <div>
                <CardTitle>Fluxo de Caixa</CardTitle>
                <CardDescription>
                Visualize as entradas e saídas financeiras da sua operação.
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
                        Filtrar Período
                    </Button>
                </div>
            </div>
        </CardContent>
       </Card>

       <div className="grid md:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-green-600">R$ 150.800,00</p>
                    <p className="text-xs text-muted-foreground">No período selecionado</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-red-600">R$ 89.500,00</p>
                    <p className="text-xs text-muted-foreground">No período selecionado</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Saldo Final</CardTitle>
                    <DollarSign className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-primary">R$ 61.300,00</p>
                    <p className="text-xs text-muted-foreground">No período selecionado</p>
                </CardContent>
            </Card>
       </div>

        <Card>
            <CardHeader>
                <CardTitle>Evolução do Fluxo de Caixa</CardTitle>
                <CardDescription>Entradas vs. Saídas nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={cashFlowData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${Number(value) / 1000}k`} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                        <Legend wrapperStyle={{fontSize: "14px"}} />
                        <Bar dataKey="entradas" name="Entradas" fill="#16a34a" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="saidas" name="Saídas" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Últimas Transações</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right">Valor (R$)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {recentTransactions.map((transaction, index) => (
                         <TableRow key={index}>
                            <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className={`text-right font-medium ${transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </TableCell>
                        </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
