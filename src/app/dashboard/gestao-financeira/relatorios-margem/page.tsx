
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  TableFooter,
} from '@/components/ui/table';
import { BarChart, Search, FileDown, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function RelatoriosMargemPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
           <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-md">
                <BarChart className="h-6 w-6" />
            </div>
            <div>
                <CardTitle>Análise de Margem de Lucro por Operação</CardTitle>
                <CardDescription>
                Filtre para analisar a rentabilidade de suas exportações.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                    <Label htmlFor="date-from">Período De</Label>
                    <Input id="date-from" type="date" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="date-to">Até</Label>
                    <Input id="date-to" type="date" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="client-filter">Cliente</Label>
                    <Select>
                        <SelectTrigger id="client-filter">
                            <SelectValue placeholder="Todos os clientes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os clientes</SelectItem>
                            <SelectItem value="cliente1">Importadora Exemplo LLC</SelectItem>
                            <SelectItem value="cliente2">Global Trade Corp</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="product-filter">Produto</Label>
                     <Select>
                        <SelectTrigger id="product-filter">
                            <SelectValue placeholder="Todos os produtos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os produtos</SelectItem>
                            <SelectItem value="cafe">Café Especial Torrado</SelectItem>
                            <SelectItem value="soja">Soja em Grãos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="flex justify-end">
                <Button>
                    <Search className="mr-2 h-4 w-4" />
                    Analisar
                </Button>
            </div>
        </CardContent>
       </Card>

       <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Resultado da Análise</CardTitle>
                    <CardDescription>Operação: CI-2024-001 - Importadora Exemplo LLC</CardDescription>
                </div>
                 <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar Relatório
                </Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4 text-center">
                <Card className="bg-blue-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-800">Valor da Venda (FOB)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-blue-900">R$ 109.000,00</p>
                        <p className="text-xs text-blue-700">(USD 20.000,00)</p>
                    </CardContent>
                </Card>
                 <Card className="bg-red-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-red-800">Custo Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-red-900">R$ 95.892,50</p>
                         <p className="text-xs text-red-700">(Soma dos custos abaixo)</p>
                    </CardContent>
                </Card>
                 <Card className="bg-green-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-800">Lucro Líquido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-900">R$ 13.107,50</p>
                        <p className="text-xs text-green-700">(Venda - Custos)</p>
                    </CardContent>
                </Card>
                 <Card className="bg-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-900">Margem de Lucro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-950">12.02%</p>
                        <p className="text-xs text-green-800">(Lucro / Venda)</p>
                    </CardContent>
                </Card>
            </div>
             <Separator />
             <div>
                <h3 className="text-lg font-semibold mb-4">Detalhamento de Custos da Operação</h3>
                 <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-3/5">Descrição do Custo</TableHead>
                                <TableHead className="w-2/5 text-right">Valor (R$)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Custo do Produto</TableCell>
                                <TableCell className="text-right">R$ 75.000,00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Frete Nacional (Fábrica → Porto)</TableCell>
                                <TableCell className="text-right">R$ 1.500,00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Despesas Portuárias (THC, etc)</TableCell>
                                <TableCell className="text-right">R$ 1.200,00</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Serviços do Despachante</TableCell>
                                <TableCell className="text-right">R$ 2.000,00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Impostos de Exportação (IE, PIS, COFINS)</TableCell>
                                <TableCell className="text-right">R$ 19.892,50</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Outras Despesas (Certificados, etc)</TableCell>
                                <TableCell className="text-right">R$ 800,00</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow className="bg-muted/50">
                                <TableHead className="text-right">Custo Total da Operação</TableHead>
                                <TableHead className="text-right text-lg font-bold">R$ 95.892,50</TableHead>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
             </div>
        </CardContent>
       </Card>
    </div>
  );
}
