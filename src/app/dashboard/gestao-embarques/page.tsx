
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
import { Badge } from '@/components/ui/badge';
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


const embarques = [
  {
    id: 1,
    referencia: 'SEN2378-25',
    cliente: 'Agrícola Exemplo LTDA',
    produto: 'Soja em Grãos',
    navio: 'MSC CARMEN',
    origemDestino: 'Santos / Xangai',
    analista: 'Ana Silva',
    status: 'Em trânsito',
  },
   {
    id: 2,
    referencia: 'SEN2378-26',
    cliente: 'Comércio de Grãos Brasil S.A.',
    produto: 'Milho em Grãos',
    navio: 'MAERSK LINE',
    origemDestino: 'Paranaguá / Roterdã',
    analista: 'Carlos Dias',
    status: 'Aguardando embarque',
  },
  {
    id: 3,
    referencia: 'SEN2378-27',
    cliente: 'Fazenda Sol Nascente',
    produto: 'Feijão Carioca Tipo 1',
    navio: 'CMA CGM',
    origemDestino: 'Itajaí / Singapura',
    analista: 'Ana Silva',
    status: 'Concluído',
  },
    {
    id: 4,
    referencia: 'SEN2378-28',
    cliente: 'Produtores Associados',
    produto: 'Gergelim Branco',
    navio: 'HAPAG-LLOYD',
    origemDestino: 'Santos / Dubai',
    analista: 'Daniela Lima',
    status: 'Atrasado',
  },
];

const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'em trânsito':
            return 'default';
        case 'concluído':
            return 'default';
        case 'aguardando embarque':
            return 'secondary';
        case 'atrasado':
            return 'destructive';
        default:
            return 'outline';
    }
}


export default function GestaoEmbarquesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestão de Embarques</CardTitle>
            <CardDescription>
              Gerencie todos os seus embarques em um só lugar.
            </CardDescription>
          </div>
           <Link href="/dashboard/gestao-embarques/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Embarque
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por referência ou cliente..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referência</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Navio</TableHead>
              <TableHead>Origem/Destino</TableHead>
              <TableHead>Analista</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {embarques.map((embarque) => (
              <TableRow key={embarque.id}>
                <TableCell className="font-medium">{embarque.referencia}</TableCell>
                <TableCell>{embarque.cliente}</TableCell>
                <TableCell>{embarque.produto}</TableCell>
                <TableCell>{embarque.navio}</TableCell>
                <TableCell>{embarque.origemDestino}</TableCell>
                <TableCell>{embarque.analista}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(embarque.status)} className={
                        embarque.status === 'Em trânsito' ? 'bg-blue-100 text-blue-800' :
                        embarque.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                        embarque.status === 'Aguardando embarque' ? 'bg-yellow-100 text-yellow-800' :
                        embarque.status === 'Atrasado' ? 'bg-red-100 text-red-800' : ''
                    }>
                        {embarque.status}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                        <Link href={`/dashboard/gestao-embarques/novo?id=${embarque.id}&edit=true`} passHref>
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
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o embarque
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

