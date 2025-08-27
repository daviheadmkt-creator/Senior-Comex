
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const reportOptions = [
    {
        id: 'dre',
        title: 'DRE (Demonstrativo de Resultados)',
        description: 'Visão completa de receitas, custos e despesas para apurar o resultado líquido do exercício.',
    },
    {
        id: 'fluxo_caixa',
        title: 'Fluxo de Caixa Consolidado',
        description: 'Relatório detalhado de todas as entradas e saídas de caixa por período.',
    },
    {
        id: 'centro_custo',
        title: 'Relatório por Centro de Custo',
        description: 'Análise de despesas e receitas agrupadas por departamento ou centro de custo.',
    },
    {
        id: 'cliente_fornecedor',
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

    const generatePdf = (reportTitle: string) => {
        const doc = new jsPDF();
        const today = new Date();
        const dateStr = today.toLocaleDateString('pt-BR');

        doc.setFontSize(18);
        doc.text(reportTitle, 14, 22);
        doc.setFontSize(11);
        doc.text(`Gerado em: ${dateStr}`, 14, 30);
        
        // Exemplo de dados para a tabela
        const tableColumn = ["Descrição", "Valor (R$)"];
        const tableRows = [
            ["Receita Bruta", "150.000,00"],
            ["(-) Deduções e Impostos", "-18.000,00"],
            ["(=) Receita Líquida", "132.000,00"],
            ["(-) Custos (CPV)", "-75.000,00"],
            ["(=) Lucro Bruto", "57.000,00"],
            ["(-) Despesas Operacionais", "-22.000,00"],
            ["(=) Lucro Operacional", "35.000,00"],
             ["(-) Despesas Financeiras", "-5.000,00"],
            ["(=) Lucro Líquido", "30.000,00"],
        ];

        (doc as any).autoTable({
            startY: 40,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [22, 163, 74] },
        });

        doc.save(`${reportTitle.replace(/\s/g, '_')}_${dateStr}.pdf`);
    };

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
                        <div key={option.id} className="flex items-center justify-between rounded-lg border p-4">
                           <div>
                                <p className="font-semibold">{option.title}</p>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                           <Button variant="outline" onClick={() => generatePdf(option.title)}>
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
