
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Eye, Pencil, Trash2 } from 'lucide-react';
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


const clients: any[] = [];

const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'ativo':
            return 'default';
        case 'inativo':
            return 'secondary';
        case 'em prospecção':
            return 'outline';
        default:
            return 'secondary';
    }
}


export default function ListaClientesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Gerencie os clientes da sua empresa.
            </CardDescription>
          </div>
          <Link href="/dashboard/cadastros/clientes/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome da empresa..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Empresa</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Contato Principal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.nomeEmpresa}</TableCell>
                <TableCell>{client.cnpj}</TableCell>
                <TableCell>{client.contatoPrincipal}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(client.status)}>
                        {client.status}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                        <Link href={`/dashboard/cadastros/clientes/novo?id=${client.id}&edit=true`} passHref>
                            <Button variant="outline" size="icon">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                         <Link href={`/dashboard/cadastros/clientes/novo?id=${client.id}&edit=true`} passHref>
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
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o cliente
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
