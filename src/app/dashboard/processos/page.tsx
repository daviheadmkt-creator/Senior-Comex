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
import { PlusCircle, Search, Pencil, Trash2, Loader2, Globe } from 'lucide-react';
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
import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';


const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return 'outline';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('trânsito') || lowerStatus.includes('confirmado') || lowerStatus.includes('aprovados') || lowerStatus.includes('desembaraçada') || lowerStatus.includes('deferido') || lowerStatus.includes('realizada')) return 'default';
    if (lowerStatus.includes('concluído') || lowerStatus.includes('pronto')) return 'outline';
    if (lowerStatus.includes('aguardando') || lowerStatus.includes('iniciado')) return 'secondary';
    if (lowerStatus.includes('atrasado') || lowerStatus.includes('cancelado') || lowerStatus.includes('correcao')) return 'destructive';
    return 'outline';
};

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
        return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
        return 'Data Inválida';
    }
}

export default function GestaoProcessosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();

  const processosCollection = useMemoFirebase(() => firestore ? collection(firestore, 'processos') : null, [firestore]);
  const { data: processos, isLoading } = useCollection(processosCollection);

  const handleDelete = (id: string) => {
    if(!firestore) return;
    deleteDocumentNonBlocking(doc(firestore, 'processos', id));
  };
  
  const filteredProcessos = useMemo(() => {
    if (!processos) return [];
    return processos.filter(processo => 
      (processo.processo_interno && processo.processo_interno.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (processo.exportadorNome && processo.exportadorNome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (processo.po_number && processo.po_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [processos, searchTerm]);

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
                placeholder="Buscar por Processo, Cliente ou PO..." 
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
              <TableHead>PO</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Navio</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                    <div className='flex justify-center items-center p-4'>
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filteredProcessos.map((processo) => (
              <TableRow key={processo.id}>
                <TableCell className="font-medium">{processo.processo_interno}</TableCell>
                <TableCell>{processo.po_number}</TableCell>
                <TableCell>{processo.exportadorNome}</TableCell>
                <TableCell>{processo.produtoNome}</TableCell>
                <TableCell>{processo.navio}</TableCell>
                <TableCell>{processo.destino}</TableCell>
                <TableCell>{formatDate(processo.eta)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(processo.status)}>
                    {processo.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <Link href={`/portal/embarques?exportadorId=${processo.exportadorId}`} passHref legacyBehavior>
                      <a target="_blank">
                        <Button variant="outline" size="icon" className="text-blue-600 hover:text-blue-700" title="Ver Portal do Cliente">
                          <Globe className="h-4 w-4" />
                        </Button>
                      </a>
                    </Link>
                    <Link href={`/dashboard/processos/novo?id=${processo.id}&edit=true`} passHref>
                      <Button variant="outline" size="icon" className="text-green-600 hover:text-green-700" title="Editar Processo">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700" title="Excluir Processo">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente o processo.
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
             {!isLoading && filteredProcessos.length === 0 && (
                <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">Nenhum processo encontrado.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
    