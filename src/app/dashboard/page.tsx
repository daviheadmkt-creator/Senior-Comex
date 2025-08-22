import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp, FileDown, Search } from 'lucide-react';
import  AISummarizer  from '@/components/ai-summarizer';

const operations = [
  {
    id: 'ORD-001',
    product: 'Soja',
    origin: 'Brasil',
    destination: 'China',
    status: 'Em Trânsito',
    updated: '2024-05-22',
    by: 'logistics_op1',
  },
  {
    id: 'ORD-002',
    product: 'Milho',
    origin: 'EUA',
    destination: 'México',
    status: 'Entregue',
    updated: '2024-05-20',
    by: 'finance_user',
  },
  {
    id: 'ORD-003',
    product: 'Trigo',
    origin: 'Canadá',
    destination: 'Egito',
    status: 'Processando',
    updated: '2024-05-23',
    by: 'operator2',
  },
  {
    id: 'ORD-004',
    product: 'Grãos de Café',
    origin: 'Colômbia',
    destination: 'Alemanha',
    status: 'Entregue',
    updated: '2024-05-19',
    by: 'admin',
  },
  {
    id: 'ORD-005',
    product: 'Cana de Açúcar',
    origin: 'Brasil',
    destination: 'Índia',
    status: 'Em Espera',
    updated: '2024-05-21',
    by: 'logistics_op2',
  },
  {
    id: 'ORD-006',
    product: 'Algodão',
    origin: 'EUA',
    destination: 'Vietnã',
    status: 'Em Trânsito',
    updated: '2024-05-23',
    by: 'logistics_op1',
  },
];

const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status) {
    case 'Entregue':
      return 'default';
    case 'Em Trânsito':
      return 'secondary';
    case 'Processando':
      return 'outline';
    case 'Em Espera':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Relatórios por IA</CardTitle>
          <CardDescription>
            Gere um resumo conciso de seus relatórios operacionais usando IA para insights rápidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AISummarizer />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Operações Recentes</CardTitle>
              <CardDescription>
                Uma visão geral das operações recentes de comércio e logística.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar operações..." className="pl-8 w-full sm:w-64" />
              </div>
              <Button variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                Importar
              </Button>
              <Button>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead className="hidden md:table-cell">Produto</TableHead>
                <TableHead className="hidden lg:table-cell">Origem</TableHead>
                <TableHead className="hidden lg:table-cell">Destino</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Última Atualização</TableHead>
                <TableHead className="hidden sm:table-cell">Atualizado Por</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.map((op) => (
                <TableRow key={op.id}>
                  <TableCell className="font-medium">{op.id}</TableCell>
                  <TableCell className="hidden md:table-cell">{op.product}</TableCell>
                  <TableCell className="hidden lg:table-cell">{op.origin}</TableCell>
                  <TableCell className="hidden lg:table-cell">{op.destination}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(op.status)}>{op.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{op.updated}</TableCell>
                  <TableCell className="hidden sm:table-cell">{op.by}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
