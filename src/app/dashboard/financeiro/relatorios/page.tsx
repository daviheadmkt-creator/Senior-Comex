
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
import { Download } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';

const reportOptions = [
    {
        title: 'DRE (Demonstrativo de Resultados)',
        description: 'Visão completa de receitas, custos e despesas para apurar o resultado líquido do exercício.',
    },
    {
        title: 'Fluxo de Caixa Consolidado',
        description: 'Relatório detalhado de todas as entradas e saídas de caixa por período.',
    },
    {
        title: 'Relatório por Centro de Custo',
        description: 'Análise de despesas e receitas agrupadas por departamento ou centro de custo.',
    },
    {
        title: 'Relatório por Cliente/Fornecedor',
        description: 'Extrato financeiro consolidado para um cliente ou fornecedor específico.',
    }
]

const clients = [
  { id: 1, nome: 'Agrícola Exemplo LTDA' },
  { id: 2, nome: 'Comércio de Grãos Brasil S.A.' },
  { id: 3, nome: 'MSC' },
  { id: 4, nome: 'Sérgio Despachos' },
];


export default function RelatoriosFinanceirosPage() {
  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Financeiros</CardTitle>
            <CardDescription>
              Gere e exporte relatórios detalhados para análise estratégica e contábil.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
                <div className='grid md:grid-cols-3 gap-4 border rounded-lg p-4'>
                    <div className='space-y-2'>
                        <Label>Data Inicial</Label>
                        <DatePicker />
                    </div>
                     <div className='space-y-2'>
                        <Label>Data Final</Label>
                        <DatePicker />
                    </div>
                     <div className='space-y-2'>
                        <Label>Cliente / Fornecedor</Label>
                         <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map((client) => (
                                    <SelectItem key={client.id} value={String(client.id)}>
                                        {client.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="space-y-4">
                    {reportOptions.map((option) => (
                        <div key={option.title} className="flex items-center justify-between rounded-lg border p-4">
                           <div>
                                <p className="font-semibold">{option.title}</p>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                           <Button variant="outline">
                             <Download className="mr-2 h-4 w-4" />
                             Gerar Relatório
                           </Button>
                        </div>
                    ))}
                </div>
          </CardContent>
        </Card>
    </div>
  );
}
