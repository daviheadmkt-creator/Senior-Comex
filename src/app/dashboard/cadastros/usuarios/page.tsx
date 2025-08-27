
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
import { Badge } from '@/components/ui/badge';

const usuarios = [
  {
    id: 1,
    nome: 'Ana Silva',
    email: 'ana.silva@empresa.com',
    perfil: 'Gestor',
    status: 'Ativo',
  },
  {
    id: 2,
    nome: 'Bruno Costa',
    email: 'bruno.costa@cliente.com',
    perfil: 'Cliente',
    status: 'Ativo',
  },
  {
    id: 3,
    nome: 'Carlos Dias',
    email: 'carlos.dias@empresa.com',
    perfil: 'Analista',
    status: 'Inativo',
  },
  {
    id: 4,
    nome: 'Daniela Lima',
    email: 'daniela.lima@empresa.com',
    perfil: 'Analista',
    status: 'Ativo',
  },
];

const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'ativo':
            return 'default';
        case 'inativo':
            return 'secondary';
        default:
            return 'secondary';
    }
}

export default function ListaUsuariosPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>
              Gerencie os usuários e suas permissões no sistema.
            </CardDescription>
          </div>
          <Link href="/dashboard/cadastros/usuarios/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome ou e-mail..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>{usuario.perfil}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(usuario.status)} className={
                        usuario.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                    }>
                        {usuario.status}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                        <Link href={`/dashboard/cadastros/usuarios/novo?id=${usuario.id}&edit=true`} passHref>
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
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o usuário
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
