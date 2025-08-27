
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Pencil, Trash2 } from 'lucide-react';
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


const products = [
  {
    id: 1,
    codigo: 'FEJ-001',
    descricao: 'Feijão Carioca Tipo 1',
    ncm: '0713.33.19',
    unidade: 'SC 60kg',
  },
  {
    id: 2,
    codigo: 'SOJ-001',
    descricao: 'Soja em Grãos',
    ncm: '1201.90.00',
    unidade: 'TN',
  },
  {
    id: 3,
    codigo: 'MIL-001',
    descricao: 'Milho em Grãos',
    ncm: '1005.90.10',
    unidade: 'TN',
  },
  {
    id: 4,
    codigo: 'GER-001',
    descricao: 'Gergelim Branco',
    ncm: '1207.40.90',
    unidade: 'KG',
  },
];


export default function ListaProdutosPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>
              Gerencie os produtos da sua empresa.
            </CardDescription>
          </div>
          <Link href="/dashboard/cadastros/produtos/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por descrição do produto..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código Interno</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>NCM</TableHead>
              <TableHead>Unidade de Medida</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.codigo}</TableCell>
                <TableCell>{product.descricao}</TableCell>
                <TableCell>{product.ncm}</TableCell>
                <TableCell>{product.unidade}</TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                        <Link href={`/dashboard/cadastros/produtos/novo?id=${product.id}&edit=true`} passHref>
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
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o produto
                                e removerá seus dados de nossos servidores.
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
