
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';


const logs: any[] = [];

export default function LogPage() {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  const userDocRef = useMemoFirebase(
    () => (currentUser ? doc(firestore, 'users', currentUser.uid) : null),
    [firestore, currentUser]
  );
  const { data: currentUserData, isLoading: isUserDocLoading } = useDoc(userDocRef);


  useEffect(() => {
    if (!isUserDocLoading) {
      setIsAdmin(currentUserData?.funcao === 'Administrador');
      setIsAdminVerified(true);
    }
  }, [currentUserData, isUserDocLoading]);


  const usersCollectionQuery = useMemoFirebase(
    () => (isAdminVerified && isAdmin ? collection(firestore, 'users') : null),
    [firestore, isAdminVerified, isAdmin]
  );
  const { data: usuarios, isLoading: isLoadingUsers } = useCollection(usersCollectionQuery);

  const isLoading = isUserDocLoading || (isAdmin && !usuarios);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/configuracoes" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatório de Log</h1>
          <p className="text-muted-foreground">
            Visualize o histórico de atividades e alterações no sistema.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Atividades</CardTitle>
          <CardDescription>
            Filtre e busque por logs específicos do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6 border p-4 rounded-lg">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <DatePicker />
            </div>
            <div className="space-y-2">
              <Label>Data Final</Label>
              <DatePicker />
            </div>
             <div className="space-y-2">
              <Label htmlFor="usuario-filter">Usuário</Label>
              <Select disabled={!isAdminVerified || !isAdmin || isLoadingUsers}>
                <SelectTrigger id="usuario-filter">
                  <SelectValue placeholder={isLoading ? 'Verificando...' : (isAdmin ? 'Todos os usuários' : 'Acesso restrito')} />
                </SelectTrigger>
                <SelectContent>
                  {isAdmin && (
                    <>
                      <SelectItem value="todos">Todos os usuários</SelectItem>
                      {usuarios?.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>{u.nome}</SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
             <div className='flex items-end'>
                <Button className='w-full'>Filtrar</Button>
             </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
               {logs.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum log encontrado.</TableCell>
                </TableRow>
            )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
