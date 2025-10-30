
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
import { PlusCircle, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
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
import { useState } from 'react';

export default function ListaUsuariosPage() {
  const firestore = useFirestore();
  const { user: currentUser, isUserLoading: isAuthLoading } = useUser();
  const [hasAdminCheckCompleted, setHasAdminCheckCompleted] = useState(false);

  const userDocRef = useMemoFirebase(
    () => (firestore && currentUser ? doc(firestore, 'users', currentUser.uid) : null),
    [firestore, currentUser]
  );
  const { data: currentUserData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const isUserAdmin = currentUserData?.funcao === 'Administrador';

  // This will only create the query if the admin check is complete AND the user is an admin.
  const usersCollection = useMemoFirebase(
    () => (firestore && hasAdminCheckCompleted && isUserAdmin ? collection(firestore, 'users') : null),
    [firestore, hasAdminCheckCompleted, isUserAdmin]
  );
  
  // This hook will now only run when the query is not null.
  const { data: users, isLoading: isUsersListLoading, error: usersListError } = useCollection(usersCollection);

  // Once the user data has loaded, we know whether they are an admin or not.
  // We can then update the state to allow the usersCollection query to run.
  if (!isUserDocLoading && !hasAdminCheckCompleted) {
    setHasAdminCheckCompleted(true);
  }

  const isLoading = isAuthLoading || isUserDocLoading;

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
    // Show initial loading state while checking user's role
    if (isLoading || !hasAdminCheckCompleted) {
       return (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              <div className='flex items-center justify-center gap-2'>
                <Loader2 className='h-5 w-5 animate-spin' />
                <span>Verificando permissões...</span>
              </div>
            </TableCell>
          </TableRow>
       );
    }
    
    // After checking, if the user is not an admin, show permission error
    if (!isUserAdmin) {
       return (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              Você não tem permissão para visualizar os usuários.
            </TableCell>
          </TableRow>
       );
    }

    // If the user is an admin, but the user list is still loading
    if (isUsersListLoading) {
        return (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
               <div className='flex items-center justify-center gap-2'>
                <Loader2 className='h-5 w-5 animate-spin' />
                <span>Carregando usuários...</span>
              </div>
            </TableCell>
          </TableRow>
       );
    }

    // If there was an error fetching the user list
    if (usersListError) {
        return (
            <TableRow>
                <TableCell colSpan={5} className="text-center text-destructive">
                    Erro ao carregar usuários: {usersListError.message}
                </TableCell>
            </TableRow>
        );
    }
    
    // If the user is an admin and the list is empty
    if (!users || users.length === 0) {
        return (
             <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum usuário encontrado.
                </TableCell>
            </TableRow>
        );
    }

    // If everything is fine, render the user list
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
