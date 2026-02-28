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

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '---';
    try {
        return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
        return '---';
    }
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
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestão de Processos</CardTitle>
            <CardDescription>
              Acompanhe todos os seus processos de exportação com visualização operacional detalhada.
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
      <CardContent className="px-0">
        <div className="flex items-center pb-4">
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

        <Card className="overflow-hidden border-primary/30">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-primary/20 text-[10px]">
                <thead>
                  <tr className="bg-primary text-primary-foreground text-center h-12">
                    <th className="border border-primary-foreground/20 px-2 min-w-[150px]">PROCESSO / CLIENTE / PRODUTO</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[110px]">DEAD LINE</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[130px]">STATUS / LOGÍSTICA</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[160px]">DADOS CONTAINERS<br/>NOTAS REMESSA<br/>NOTAS EXPORTAÇÃO</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[160px]">LPCO<br/>INSPEÇÃO (MAPA)<br/>TRATAMENTO</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[160px]">DUE<br/>DESEMBARAÇO<br/>AVERBAÇÃO</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[80px]">BL</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[80px]">ORIGEM</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[80px]">FITO</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[80px]">HEALTH</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[80px]">FUMIGATION</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[80px]">QUALITY</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[80px]">INVOICE</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[80px]">PACKING</th>
                    <th className="border border-primary-foreground/20 px-2 min-w-[100px]">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={15} className="text-center py-10">
                        <div className='flex justify-center items-center gap-2'>
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <span className="text-sm font-medium">Carregando processos...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!isLoading && filteredProcessos.map((processo) => {
                    const getDocStatus = (name: string) => {
                      const doc = processo.documentos_pos_embarque?.find((d: any) => d.nome === name);
                      return {
                        status: doc ? 'APROVADO' : '---',
                        action: doc ? (name === 'BL' ? 'LIBERADO/TELEX' : 'RECEBIDO EM') : '---',
                        date: doc?.data_liberacao ? formatDate(doc.data_liberacao) : '---'
                      };
                    };

                    const getNFDate = (type: string) => {
                      const nf = processo.notas_fiscais?.find((n: any) => n.tipo === type);
                      return nf?.data_recebida ? formatDate(nf.data_recebida) : '---';
                    };

                    const bl = getDocStatus('BL');
                    const origem = getDocStatus('ORIGEM');
                    const fito = getDocStatus('FITO');
                    const pragas = getDocStatus('HEALTH');
                    const fumigacao = getDocStatus('FUMIGATION');
                    const supervisora = getDocStatus('QUALITY');
                    const invoice = getDocStatus('INVOICE');
                    const packing = getDocStatus('PACKING LIST');

                    return (
                      <tr key={processo.id} className="bg-background text-primary font-bold border-b border-primary/10 hover:bg-accent/5 transition-colors">
                        {/* PROCESSO / CLIENTE / PRODUTO */}
                        <td className="border-r border-primary/10 p-0">
                          <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                            <div className="px-2 py-1.5 flex flex-col">
                                <span className="text-foreground text-[11px] font-extrabold">{processo.processo_interno}</span>
                                <span className="text-[8px] text-muted-foreground">PO: {processo.po_number || '---'}</span>
                            </div>
                            <div className="px-2 py-1.5 text-primary/70 uppercase truncate max-w-[140px]" title={processo.exportadorNome}>
                                {processo.exportadorNome}
                                <br />
                                <span className="text-blue-600 text-[8px] italic normal-case">{processo.analistaNome || 'Sem Analista'}</span>
                            </div>
                            <div className="px-2 py-1.5 text-[9px] truncate text-foreground/80">{processo.produtoNome || '---'}</div>
                          </div>
                        </td>
                        {/* DEAD LINE */}
                        <td className="border-r border-primary/10 p-0">
                          <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                            <div className="flex justify-between px-2 py-1.5 italic"><span>DRAFT</span> <span className="text-destructive font-bold ml-2">{formatDate(processo.deadline_draft)}</span></div>
                            <div className="flex justify-between px-2 py-1.5 italic"><span>VGM</span> <span className="text-destructive font-bold ml-2">{formatDate(processo.deadline_vgm)}</span></div>
                            <div className="flex justify-between px-2 py-1.5 italic"><span>CARGA</span> <span className="text-destructive font-bold ml-2">{formatDate(processo.deadline_carga)}</span></div>
                          </div>
                        </td>
                        {/* STATUS / LOGÍSTICA */}
                        <td className="border-r border-primary/10 p-0 text-center font-bold uppercase bg-accent/10">
                          <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                            <div className="px-2 py-1.5 flex items-center justify-center text-[9px] leading-tight">{processo.status || 'N/A'}</div>
                            <div className="px-2 py-1.5 flex flex-col justify-center text-[8px] font-normal leading-tight">
                                <span className="truncate max-w-[120px]">{processo.navio || 'SEM NAVIO'}</span>
                                <span className="text-[7px] truncate max-w-[120px]">{processo.portoEmbarqueNome} → {processo.portoDescargaNome}</span>
                            </div>
                            <div className="px-2 py-1.5 flex justify-between text-[8px] font-bold">
                                <span>ETD: {formatDate(processo.etd)}</span>
                                <span className="text-primary">ETA: {formatDate(processo.eta)}</span>
                            </div>
                          </div>
                        </td>
                        {/* DADOS CONTAINERS / NOTAS */}
                        <td className="border-r border-primary/10 p-0">
                          <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                            <div className="flex justify-between px-2 py-1.5 italic"><span>CONTAINERS</span> <span className="text-destructive font-bold ml-2">{processo.containers?.length > 0 ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                            <div className="flex justify-between px-2 py-1.5 italic"><span>REMESSA</span> <span className="text-destructive font-bold ml-2">{getNFDate('Remessa')}</span></div>
                            <div className="flex justify-between px-2 py-1.5 italic"><span>EXPORTAÇÃO</span> <span className="text-destructive font-bold ml-2">{getNFDate('Exportação')}</span></div>
                          </div>
                        </td>
                        {/* LPCO / INSPEÇÃO / TRATAMENTO */}
                        <td className="border-r border-primary/10 p-0">
                          <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                            <div className="flex justify-between px-2 py-1.5 italic"><span>LPCO</span> <span className="text-muted-foreground font-bold ml-2 truncate max-w-[80px]">{processo.lpco_protocolo || '---'}</span></div>
                            <div className="flex justify-between px-2 py-1.5 italic"><span>INSPEÇÃO</span> <span className="text-destructive font-bold ml-2">{processo.mapa_status?.includes('DEFERIDA') ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                            <div className="flex justify-between px-2 py-1.5 italic"><span>TRATAMENTO</span> <span className="text-destructive font-bold ml-2">{fumigacao.date}</span></div>
                          </div>
                        </td>
                        {/* DUE / DESEMBARAÇO / AVERBAÇÃO */}
                        <td className="border-r border-primary/10 p-0">
                          <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                            <div className="flex justify-between px-2 py-1.5 italic"><span>DUE</span> <span className="text-muted-foreground font-bold ml-2 truncate max-w-[80px]">{processo.due_numero || '---'}</span></div>
                            <div className="flex justify-between px-2 py-1.5 italic"><span>DESEMBARAÇO</span> <span className="text-destructive font-bold ml-2">{processo.due_status?.includes('DESEMBARAÇADA') ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                            <div className="flex justify-between px-2 py-1.5 italic"><span>AVERBADA</span> <span className="text-destructive font-bold ml-2">{processo.due_status === 'AVERBADA' ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                          </div>
                        </td>
                        {/* DOCS POS-EMBARQUE */}
                        {[bl, origem, fito, pragas, fumigacao, supervisora, invoice, packing].map((doc, idx) => (
                          <td key={idx} className="border-r border-primary/10 p-0 text-center">
                            <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                              <div className="py-1.5 uppercase text-primary font-bold">{doc.status}</div>
                              <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{doc.action}</div>
                              <div className="py-1.5 text-destructive font-bold">{doc.date}</div>
                            </div>
                          </td>
                        ))}
                        {/* AÇÕES */}
                        <td className="p-2 text-center align-middle">
                          <div className='flex flex-col gap-1 items-center justify-center'>
                            <div className="flex gap-1">
                                {processo.exportadorId && (
                                    <Link href={`/portal/${processo.exportadorId}`} passHref target="_blank">
                                        <Button variant="outline" size="icon" className="h-7 w-7" title="Abrir Portal do Cliente">
                                            <Globe className="h-3 w-3" />
                                        </Button>
                                    </Link>
                                )}
                                <Link href={`/dashboard/processos/novo?id=${processo.id}&edit=true`} passHref>
                                  <Button variant="outline" size="icon" className="h-7 w-7 text-green-600 hover:text-green-700" title="Editar Processo">
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                </Link>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" className="h-7 w-7 text-red-600 hover:text-red-700" title="Excluir Processo">
                                  <Trash2 className="h-3 w-3" />
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
                        </td>
                      </tr>
                    );
                  })}
                  {!isLoading && filteredProcessos.length === 0 && (
                    <tr>
                      <td colSpan={15} className="text-center text-muted-foreground py-10">Nenhum processo encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}