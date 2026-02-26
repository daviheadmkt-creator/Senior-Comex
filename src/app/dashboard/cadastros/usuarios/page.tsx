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
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { deleteDoc, doc, getFunctions, httpsCallable } from 'firebase/firestore';
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSearch } from '@/components/search-provider';

// This interface must match the one in the Cloud Function return type
export interface UserRecord {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
  // Firestore data
  nome?: string;
  funcao?: string;
  status?: string;
}


export default function ListaUsuariosPage() {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const { toast } = useToast();
  const { searchTerm, setSearchTerm } = useSearch();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const userDocRef = useMemoFirebase(
    () => (currentUser ? doc(firestore, 'users', currentUser.uid) : null),
    [firestore, currentUser]
  );
  const { data: currentUserData, isLoading: isUserDocLoading } = useDoc(userDocRef);
  
  useEffect(() => {
    if (!isUserDocLoading && currentUser) {
      const isAdminUser = currentUserData?.funcao === 'Administrador';
      setIsAdmin(isAdminUser);
      setIsAdminVerified(true);
      
      if (isAdminUser) {
        setIsLoadingUsers(true);
        const functions = getFunctions();
        const listUsersFunction = httpsCallable(functions, 'listusers');

        listUsersFunction()
            .then(response => {
                const userList = response.data as UserRecord[];
                setUsers(userList);
            })
            .catch(error => {
                console.error("Erro ao buscar usuários:", error);
                toast({
                    title: 'Erro ao Listar Usuários',
                    description: error.message,
                    variant: 'destructive',
                });
            })
            .finally(() => {
                setIsLoadingUsers(false);
            });
      } else {
          setIsLoadingUsers(false);
      }
    }
  }, [currentUser, currentUserData, isUserDocLoading, toast]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      (user.nome?.toLowerCase() || '').includes(term) ||
      (user.email?.toLowerCase() || '').includes(term) ||
      (user.displayName?.toLowerCase() || '').includes(term) ||
      (user.funcao?.toLowerCase() || '').includes(term)
    );
  }, [users, searchTerm]);


  const getStatusVariant = (status: string): "destructive" | "default" => {
    return status === 'Inativo' ? 'destructive' : 'default';
  };

  const handleDelete = async (uid: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'users', uid));
        setUsers(prev => prev.filter(u => u.uid !== uid));
        toast({ title: 'Sucesso', description: 'Usuário excluído.'});
    } catch(error) {
        console.error("Error deleting user document:", error);
        toast({ title: 'Erro', description: 'Não foi possível excluir o usuário.', variant: 'destructive' });
    }
  };

  const renderContent = () => {
    const isLoading = isUserDocLoading || isLoadingUsers;

    if (isLoading) {
       return (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              <div className='flex items-center justify-center gap-2 py-4'>
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
            <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
              Você não tem permissão para visualizar os usuários.
            </TableCell>
          </TableRow>
       );
    }
    
    if (!filteredUsers || filteredUsers.length === 0) {
        return (
             <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                    Nenhum usuário encontrado na base de dados.
                </TableCell>
            </TableRow>
        );
    }

    return filteredUsers.map((user) => (
          <TableRow key={user.uid}>
            <TableCell className="font-medium">{user.nome || user.displayName || 'N/A'}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{(user as any).funcao || 'N/A'}</TableCell>
            <TableCell>
              <Badge
                variant={getStatusVariant((user as any).status)}
              >
                {(user as any).status || (user.disabled ? 'Inativo' : 'Ativo')}
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
                        Esta ação removerá o perfil do usuário da base de dados. Esta ação não pode ser desfeita.
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
            <Input 
              placeholder="Buscar por nome ou e-mail..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
            />
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
