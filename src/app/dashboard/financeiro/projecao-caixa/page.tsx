
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Filter, Calendar } from 'lucide-react';

const projectionData = [
  { name: 'Previsto', entradas: 85000, saidas: 35000 },
  { name: 'Realizado', entradas: 82500, saidas: 36200 },
];

const summaryData = [
    { period: 'Semana 1', entradas: 'R$ 20.000,00', saidas: 'R$ 8.000,00', saldo: 'R$ 12.000,00' },
    { period: 'Semana 2', entradas: 'R$ 25.000,00', saidas: 'R$ 10.000,00', saldo: 'R$ 15.000,00' },
    { period: 'Semana 3', entradas: 'R$ 18.000,00', saidas: 'R$ 7.500,00', saldo: 'R$ 10.500,00' },
    { period: 'Semana 4', entradas: 'R$ 22.000,00', saidas: 'R$ 9.500,00', saldo: 'R$ 12.500,00' },
]

export default function ProjecaoCaixaPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Projeção de Fluxo de Caixa</CardTitle>
            <CardDescription>
              Simule e compare o fluxo de caixa com base em diferentes cenários.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                 <Calendar className="h-4 w-4 text-muted-foreground" />
                 <Select defaultValue="semanal">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="diario">Diário</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="flex items-center gap-2">
                 <Filter className="h-4 w-4 text-muted-foreground" />
                 <Select defaultValue="realista">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o cenário" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="realista">Realista</SelectItem>
                        <SelectItem value="otimista">Otimista</SelectItem>
                        <SelectItem value="pessimista">Pessimista</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <Button>Aplicar Filtros</Button>
        </div>
        
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-4">Comparativo Previsto vs. Realizado (Mensal)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectionData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${Number(value) / 1000}k`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                        />
                        <Legend iconSize={10} />
                        <Bar dataKey="entradas" name="Entradas" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="saidas" name="Saídas" fill="var(--color-chart-5)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div>
                 <h3 className="text-lg font-medium mb-4">Resumo do Fluxo de Caixa (Próximas 4 Semanas)</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Período</TableHead>
                            <TableHead>Entradas</TableHead>
                            <TableHead>Saídas</TableHead>
                            <TableHead>Saldo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {summaryData.map((item) => (
                        <TableRow key={item.period}>
                            <TableCell className="font-medium">{item.period}</TableCell>
                            <TableCell className="text-green-600">{item.entradas}</TableCell>
                            <TableCell className="text-red-600">{item.saidas}</TableCell>
                            <TableCell className="font-semibold">{item.saldo}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
