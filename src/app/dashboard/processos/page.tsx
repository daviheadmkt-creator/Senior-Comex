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
import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';
import { useSearch } from '@/components/search-provider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '---';
    try {
        return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
        return '---';
    }
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return 'outline';
  const lowerStatus = status.toLowerCase();
  if (
    lowerStatus.includes('trânsito') ||
    lowerStatus.includes('confirmado') ||
    lowerStatus.includes('aprovados') ||
    lowerStatus.includes('desembaraçada') ||
    lowerStatus.includes('deferido') ||
    lowerStatus.includes('realizada') ||
    lowerStatus.includes('concluído')
  ) return 'default';
  if (lowerStatus.includes('pronto')) return 'outline';
  if (
    lowerStatus.includes('aguardando') ||
    lowerStatus.includes('iniciado') ||
    lowerStatus.includes('em aprovação') ||
    lowerStatus.includes('submetido')
  ) return 'secondary';
  if (
    lowerStatus.includes('atrasado') ||
    lowerStatus.includes('cancelado') ||
    lowerStatus.includes('correcao') ||
    lowerStatus.includes('rejeitado')
  ) return 'destructive';
  return 'outline';
};

export default function GestaoProcessosPage() {
  const { searchTerm, setSearchTerm } = useSearch();
  const firestore = useFirestore();

  const processosCollection = useMemoFirebase(() => firestore ? collection(firestore, 'processos') : null, [firestore]);
  const { data: processos, isLoading } = useCollection(processosCollection);

  const handleDelete = (id: string) => {
    if(!firestore) return;
    deleteDocumentNonBlocking(doc(firestore, 'processos', id));
  };
  
  const filteredProcessos = useMemo(() => {
    if (!processos) return [];
    const term = searchTerm.toLowerCase();
    return processos.filter(processo => 
      (processo.processo_interno && processo.processo_interno.toLowerCase().includes(term)) ||
      (processo.exportadorNome && processo.exportadorNome.toLowerCase().includes(term)) ||
      (processo.analistaNome && processo.analistaNome.toLowerCase().includes(term)) ||
      (processo.po_number && processo.po_number.toLowerCase().includes(term)) ||
      (processo.produtoNome && processo.produtoNome.toLowerCase().includes(term)) ||
      (processo.navio && processo.navio.toLowerCase().includes(term)) ||
      (processo.destino && processo.destino.toLowerCase().includes(term))
    );
  }, [processos, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Processos</h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie todos os processos de exportação ativos.
          </p>
        </div>
        <Link href="/dashboard/processos/novo" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Processo
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                  placeholder="Buscar por Processo, Cliente ou Analista..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  type="search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Processo</th>
                  <th className="px-4 py-3 text-left font-medium">Cliente / Analista</th>
                  <th className="px-4 py-3 text-left font-medium">Produto</th>
                  <th className="px-4 py-3 text-left font-medium">Logística</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <div className='flex justify-center items-center gap-2'>
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span>Carregando processos...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && filteredProcessos.map((processo) => (
                  <tr key={processo.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold">{processo.processo_interno}</div>
                      <div className="text-[10px] text-muted-foreground">PO: {processo.po_number || '---'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium uppercase">{processo.exportadorNome}</div>
                      <div className="text-xs text-blue-600 font-semibold">{processo.analistaNome || 'Sem Analista'}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {processo.produtoNome || '---'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] font-medium truncate max-w-[180px]">{processo.navio || 'SEM NAVIO'}</div>
                      <div className="text-[10px] text-muted-foreground">
                        ETD: {formatDate(processo.etd)} | ETA: {formatDate(processo.eta)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusVariant(processo.status)} className="text-[10px] whitespace-nowrap">
                        {processo.status || 'N/A'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className='flex gap-1 justify-center'>
                        {processo.exportadorId && (
                            <Link href={`/portal/${processo.exportadorId}`} passHref target="_blank">
                                <Button variant="outline" size="icon" className="h-8 w-8" title="Portal do Cliente">
                                    <Globe className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        <Link href={`/dashboard/processos/novo?id=${processo.id}&edit=true`} passHref>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700" title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" title="Excluir">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Processo</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o processo {processo.processo_interno}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(processo.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && filteredProcessos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Nenhum processo encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
