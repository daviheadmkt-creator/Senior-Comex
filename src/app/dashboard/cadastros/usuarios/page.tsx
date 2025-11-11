
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
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase, useAuth } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { listUsers, type UserRecord } from '@/ai/flows/list-users-flow';
import { deleteUser } from 'firebase/auth';


export default function ListaUsuariosPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user: currentUser } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isUsersListLoading, setIsUsersListLoading] = useState(true);
  const [usersListError, setUsersListError] = useState<Error | null>(null);

  const userDocRef = useMemoFirebase(
    () => (firestore && currentUser ? doc(firestore, 'users', currentUser.uid) : null),
    [firestore, currentUser]
  );
  const { data: currentUserData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserDocLoading && currentUserData) {
      setIsAdmin(currentUserData.funcao === 'Administrador');
      setIsAdminVerified(true);
    } else if (!isUserDocLoading && !currentUserData) {
      setIsAdminVerified(true);
    }
  }, [currentUserData, isUserDocLoading]);


  useEffect(() => {
    async function fetchUsers() {
      if (!isAdmin) {
          setIsUsersListLoading(false);
          return;
      };

      setIsUsersListLoading(true);
      try {
        const userList = await listUsers();
        // Here you could merge with Firestore data if needed
        // For now, just display auth users
        setUsers(userList);
        setUsersListError(null);
      } catch (error: any) {
        console.error("Failed to fetch users:", error);
        setUsersListError(error);
      } finally {
        setIsUsersListLoading(false);
      }
    }

    if (isAdminVerified) {
        fetchUsers();
    }
  }, [isAdmin, isAdminVerified]);


  const getStatusVariant = (disabled: boolean): "destructive" | "default" => {
    return disabled ? 'destructive' : 'default';
  };

  const handleDelete = async (uid: string) => {
    if (!firestore || !auth) return;
     // NOTE: Deleting a user from Auth requires Admin privileges, which we can't do from the client.
     // This will only delete the Firestore record.
     // A cloud function triggered on document deletion would be needed for full cleanup.
    try {
        await deleteDoc(doc(firestore, 'users', uid));
        setUsers(prevUsers => prevUsers.filter(u => u.uid !== uid));
    } catch(error) {
        console.error("Error deleting user document:", error);
    }
  };

  const renderContent = () => {
    if (!isAdminVerified || isUserDocLoading) {
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
    
    if (!isAdmin) {
       return (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              Você não tem permissão para visualizar os usuários.
            </TableCell>
          </TableRow>
       );
    }

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
          <TableRow key={user.uid}>
            <TableCell className="font-medium">{user.displayName || 'N/A'}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>N/A</TableCell>
            <TableCell>
              <Badge
                variant={getStatusVariant(user.disabled)}
              >
                {user.disabled ? 'Inativo' : 'Ativo'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/cadastros/usuarios/novo?id=${user.uid}&edit=true`}
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
                       disabled={user.uid === currentUser?.uid}
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
                        Esta ação removerá o perfil do usuário da base de dados, mas não da autenticação. Para uma remoção completa, utilize o Console do Firebase.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(user.uid)}
                      >
                        Excluir Perfil
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
          {isAdminVerified && isAdmin && (
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
