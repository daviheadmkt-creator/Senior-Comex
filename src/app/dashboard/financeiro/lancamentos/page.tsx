
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Pencil, Trash2, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';


const lancamentos = [
  {
    id: 1,
    descricao: 'Receita Venda Soja EXP-001',
    clienteFornecedor: 'Agrícola Exemplo LTDA',
    valor: 'R$ 50.000,00',
    vencimento: '30/07/2024',
    status: 'Recebido',
  },
  {
    id: 2,
    descricao: 'Despesa Frete Marítimo',
    clienteFornecedor: 'MSC',
    valor: 'R$ 5.500,00',
    vencimento: '25/07/2024',
    status: 'Pago',
  },
  {
    id: 3,
    descricao: 'Despesa Despachante Aduaneiro',
    clienteFornecedor: 'Sérgio Despachos',
    valor: 'R$ 1.200,00',
    vencimento: '01/08/2024',
    status: 'A Pagar',
  },
   {
    id: 4,
    descricao: 'Receita Venda Milho EXP-002',
    clienteFornecedor: 'Comércio de Grãos Brasil S.A.',
    valor: 'R$ 35.000,00',
    vencimento: '10/08/2024',
    status: 'A Receber',
  },
   {
    id: 5,
    descricao: 'Despesa Armazenagem',
    clienteFornecedor: 'Porto de Santos',
    valor: 'R$ 2.800,00',
    vencimento: '20/07/2024',
    status: 'Atrasado',
  },
];

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Recebido':
        case 'Pago':
            return 'default';
        case 'A Receber':
        case 'A Pagar':
            return 'secondary';
        case 'Atrasado':
            return 'destructive';
        default:
            return 'outline';
    }
}

const getStatusColor = (status: string) => {
     switch (status) {
        case 'Recebido':
        case 'Pago':
            return 'bg-green-100 text-green-800';
        case 'A Receber':
        case 'A Pagar':
            return 'bg-yellow-100 text-yellow-800';
        case 'Atrasado':
            return 'bg-red-100 text-red-800';
        default:
            return '';
    }
}


export default function LancamentosFinanceirosPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Lançamentos Financeiros</CardTitle>
            <CardDescription>
              Gerencie suas receitas e despesas.
            </CardDescription>
          </div>
          <Link href="/dashboard/financeiro/lancamentos/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Lançamento
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4 gap-2">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por descrição..." className="pl-8" />
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar Status
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Todos</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Recebido</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Pago</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>A Receber</DropdownMenuCheckboxItem>
                 <DropdownMenuCheckboxItem>A Pagar</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Atrasado</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Cliente / Fornecedor</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data de Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lancamentos.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.descricao}</TableCell>
                <TableCell>{item.clienteFornecedor}</TableCell>
                <TableCell>{item.valor}</TableCell>
                <TableCell>{item.vencimento}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(item.status)} className={getStatusColor(item.status)}>
                        {item.status}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                        <Link href={`/dashboard/financeiro/lancamentos/novo?id=${item.id}&edit=true`} passHref>
                            <Button variant="outline" size="icon" className="text-green-600 hover:text-green-700">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700">
                                 <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o lançamento.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
