
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
import { useEffect, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';


const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status.includes('Aguardando') || status.includes('EM_APROVAÇÃO') || status.includes('Iniciado')) return 'secondary';
    if (status.includes('Confirmado') || status.includes('APROVADOS') || status.includes('Desembaraçada') || status.includes('Deferido') || status.includes('Realizada') || status.includes('trânsito')) return 'default';
    if (status.includes('Atrasado') || status.includes('Cancelado') || status.includes('CORRECAO') || status.includes('Indeferido')) return 'destructive';
    if (status.includes('Concluído') || status.includes('PRONTO')) return 'outline';
    return 'default';
}

export default function GestaoProcessosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();

  const processosCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'processos') : null),
    [firestore]
  );
  const { data: processos, isLoading } = useCollection(processosCollection);

  const handleDelete = (id: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, 'processos', id));
  };
  
  const filteredProcessos = processos?.filter(processo => 
      (processo.processo_interno && processo.processo_interno.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (processo.exportadorNome && processo.exportadorNome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestão de Processos</CardTitle>
            <CardDescription>
              Acompanhe todos os seus processos de exportação em um só lugar.
            </CardDescription>
          </div>
          <Link href="/dashboard/processos/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Processo
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Buscar por Processo ou Cliente..." 
                className="pl-8" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Processo Interno</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
              </TableRow>
            )}
            {filteredProcessos?.map((processo) => (
              <TableRow key={processo.id}>
                <TableCell className="font-medium">{processo.processo_interno}</TableCell>
                <TableCell>{processo.exportadorNome}</TableCell>
                <TableCell>{processo.produtoNome}</TableCell>
                <TableCell>{processo.destino}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(processo.status)}>
                    {processo.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <Link href={`/dashboard/processos/novo?id=${processo.id}&edit=true`} passHref>
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
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente o processo
                            e removerá seus dados de nossos servidores.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(processo.id)}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
             {!isLoading && filteredProcessos?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">Nenhum processo encontrado.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
