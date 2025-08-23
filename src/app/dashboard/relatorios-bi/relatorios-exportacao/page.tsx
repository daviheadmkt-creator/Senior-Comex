
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
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
} from '@/components/ui/table';
import { BarChart, Search, FileDown } from 'lucide-react';

const reportData = [
  {
    invoice: 'CI-2024-001',
    date: '15/07/2024',
    client: 'Importadora Exemplo LLC',
    country: 'Estados Unidos',
    product: 'Café Especial Torrado',
    quantity: '1000 kg',
    value: 'USD 21,800.00',
  },
  {
    invoice: 'CI-2024-002',
    date: '20/07/2024',
    client: 'Global Trade Corp',
    country: 'Argentina',
    product: 'Soja em Grãos',
    quantity: '5000 kg',
    value: 'USD 5,400.00',
  },
   {
    invoice: 'CI-2024-003',
    date: '22/07/2024',
    client: 'Euro Importers',
    country: 'Alemanha',
    product: 'Açúcar Refinado',
    quantity: '2000 kg',
    value: 'EUR 3,200.00',
  },
];

export default function RelatoriosExportacaoPage() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
           <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-md">
                <BarChart className="h-6 w-6" />
            </div>
            <div>
                <CardTitle>Relatórios de Exportação</CardTitle>
                <CardDescription>
                Filtre e visualize relatórios de exportação por país, produto ou cliente.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 border rounded-lg">
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
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os clientes</SelectItem>
                            <SelectItem value="cliente1">Importadora Exemplo LLC</SelectItem>
                            <SelectItem value="cliente2">Global Trade Corp</SelectItem>
                            <SelectItem value="cliente3">Euro Importers</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="product-filter">Produto</Label>
                     <Select>
                        <SelectTrigger id="product-filter">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os produtos</SelectItem>
                            <SelectItem value="cafe">Café Especial Torrado</SelectItem>
                            <SelectItem value="soja">Soja em Grãos</SelectItem>
                             <SelectItem value="acucar">Açúcar Refinado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="country-filter">País</Label>
                     <Select>
                        <SelectTrigger id="country-filter">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os países</SelectItem>
                            <SelectItem value="eua">Estados Unidos</SelectItem>
                            <SelectItem value="argentina">Argentina</SelectItem>
                            <SelectItem value="alemanha">Alemanha</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="flex justify-end">
                <Button>
                    <Search className="mr-2 h-4 w-4" />
                    Gerar Relatório
                </Button>
            </div>
        </CardContent>
       </Card>

       <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Resultados</CardTitle>
                    <CardDescription>Mostrando 3 de 3 resultados para o período selecionado.</CardDescription>
                </div>
                 <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar CSV
                </Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fatura</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>País</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reportData.map((item) => (
                        <TableRow key={item.invoice}>
                            <TableCell className="font-medium">{item.invoice}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.client}</TableCell>
                            <TableCell>{item.country}</TableCell>
                            <TableCell>{item.product}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right font-mono">{item.value}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                         <TableRow>
                            <TableCell colSpan={6} className="text-right font-bold">Total USD</TableCell>
                            <TableCell className="text-right font-bold font-mono">USD 27,200.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={6} className="text-right font-bold">Total EUR</TableCell>
                            <TableCell className="text-right font-bold font-mono">EUR 3,200.00</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </CardContent>
       </Card>
    </div>
  );
}
