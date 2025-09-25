
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
import { useEffect, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';


export default function ListaParceirosPage() {
  const firestore = useFirestore();
  const partnersCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'partners') : null),
    [firestore]
  );
  const { data: partners, isLoading } = useCollection(partnersCollection);

  const handleDelete = (id: string) => {
    if (!firestore) return;
    const partnerDoc = doc(firestore, 'partners', id);
    deleteDoc(partnerDoc);
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Parceiros</CardTitle>
            <CardDescription>
              Gerencie todos os parceiros e envolvidos nos processos.
            </CardDescription>
          </div>
          <Link href="/dashboard/cadastros/parceiros/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Parceiro
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome ou CNPJ..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Fantasia</TableHead>
              <TableHead>Razão Social</TableHead>
              <TableHead>CNPJ / TAX ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5}>Carregando...</TableCell></TableRow>}
            {partners?.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.nome_fantasia}</TableCell>
                <TableCell>{partner.razao_social}</TableCell>
                <TableCell>{partner.cnpj}</TableCell>
                <TableCell>
                    <Badge variant="outline">{partner.tipo_parceiro}</Badge>
                </TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                         <Link href={`/dashboard/cadastros/parceiros/novo?id=${partner.id}&edit=true`} passHref>
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
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o parceiro
                                e removerá seus dados de nossos servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(partner.id)}>Excluir</AlertDialogAction>
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
