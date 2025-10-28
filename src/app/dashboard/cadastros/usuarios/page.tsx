
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
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';

export default function ListaUsuariosPage() {
  const firestore = useFirestore();
  const { user: currentUser, isUserLoading: isAuthLoading } = useUser();

  const userDocRef = useMemoFirebase(
    () => (firestore && currentUser ? doc(firestore, 'users', currentUser.uid) : null),
    [firestore, currentUser]
  );
  const { data: currentUserData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const isUserAdmin = currentUserData?.funcao === 'Administrador';

  const usersCollection = useMemoFirebase(
    () => (firestore && isUserAdmin ? collection(firestore, 'users') : null),
    [firestore, isUserAdmin]
  );
  const { data: users, isLoading: isUsersListLoading, error: usersListError } = useCollection(usersCollection);

  const isLoading = isAuthLoading || isUserDocLoading || (isUserAdmin && isUsersListLoading);

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'default';
      case 'inativo':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleDelete = (id: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, 'users', id));
  };

  const renderContent = () => {
    if (isLoading) {
       return (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Carregando...
            </TableCell>
          </TableRow>
       );
    }
    
    if (!isUserAdmin) {
       return (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              Você não tem permissão para visualizar os usuários.
            </TableCell>
          </TableRow>
       );
    }

    if (usersListError) {
        return (
            <TableRow>
                <TableCell colSpan={5} className="text-center text-destructive">
                    Erro ao carregar usuários: {usersListError.message}
                </TableCell>
            </TableRow>
        );
    }

    if (!users || users.length === 0) {
        return (
             <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum usuário encontrado.
                </TableCell>
            </TableRow>
        );
    }

    return users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.nome}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.funcao}</TableCell>
            <TableCell>
              <Badge
                variant={getStatusVariant(user.status)}
                className={
                  user.status === 'Ativo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/cadastros/usuarios/novo?id=${user.id}&edit=true`}
                  passHref
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:text-green-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                       disabled={user.id === currentUser?.uid}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Você tem certeza?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso excluirá
                        permanentemente o usuário e removerá seus dados de
                        nossos servidores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(user.id)}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>Gerencie os usuários do sistema.</CardDescription>
          </div>
          {isUserAdmin && (
            <Link href="/dashboard/cadastros/usuarios/novo" passHref>
                <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Usuário
                </Button>
            </Link>
          )}
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
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderContent()}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
