
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
import { useState, useEffect } from 'react';


export default function ListaUsuariosPage() {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  const userDocRef = useMemoFirebase(
    () => (currentUser ? doc(firestore, 'users', currentUser.uid) : null),
    [firestore, currentUser]
  );
  const { data: currentUserData, isLoading: isUserDocLoading } = useDoc(userDocRef);
  
  const usersCollectionQuery = useMemoFirebase(
    () => (isAdminVerified && isAdmin ? collection(firestore, 'users') : null),
    [firestore, isAdminVerified, isAdmin]
  );
  const { data: users, isLoading: isLoadingUsers } = useCollection(usersCollectionQuery);

  useEffect(() => {
    if (!isUserDocLoading) {
      setIsAdmin(currentUserData?.funcao === 'Administrador');
      setIsAdminVerified(true);
    }
  }, [currentUserData, isUserDocLoading]);


  const getStatusVariant = (status: string): "destructive" | "default" => {
    return status === 'Inativo' ? 'destructive' : 'default';
  };

  const handleDelete = async (uid: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'users', uid));
    } catch(error) {
        console.error("Error deleting user document:", error);
    }
  };

  const renderContent = () => {
    const isLoading = isUserDocLoading || (isAdmin && isLoadingUsers);

    if (isLoading) {
       return (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              <div className='flex items-center justify-center gap-2'>
                <Loader2 className='h-5 w-5 animate-spin' />
                <span>Verificando permissões e carregando usuários...</span>
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
    
    if (!users || users.length === 0) {
        return (
             <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum usuário encontrado na base de dados.
                </TableCell>
            </TableRow>
        );
    }

    return users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.nome || 'N/A'}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.funcao || 'N/A'}</TableCell>
            <TableCell>
              <Badge
                variant={getStatusVariant(user.status)}
              >
                {user.status || 'N/A'}
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
                        Esta ação removerá o perfil do usuário da base de dados. Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(user.id)}
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
