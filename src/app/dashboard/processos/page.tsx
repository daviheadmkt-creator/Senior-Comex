
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
    return [...processos].sort((a, b) => (b.processo_interno || '').localeCompare(a.processo_interno || '')).filter(processo => 
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
    <div className="space-y-6 relative min-h-[calc(100vh-120px)]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Processos</h1>
          <p className="text-muted-foreground">
            Acompanhamento técnico e operacional de todos os processos ativos.
          </p>
        </div>
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
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-primary/20 text-[10px]">
              <thead>
                <tr className="bg-primary text-primary-foreground text-center h-12 uppercase font-bold">
                  <th className="border border-primary-foreground/20 px-2 min-w-[120px]">PROCESSO / CLIENTE</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[140px]">LOGÍSTICA</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[80px]">AÇÕES</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[110px]">DEAD LINE</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[130px]">STATUS</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[160px]">DADOS CONTAINERS<br/>NOTAS REMESSA<br/>NOTAS EXPORTAÇÃO</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[160px]">LPCO<br/>INSPEÇÃO (MAPA)<br/>TRATAMENTO</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[160px]">DUE<br/>DESEMBARAÇO<br/>AVERBAÇÃO</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[100px]">BL</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[100px]">CERTIFICADO<br/>ORIGEM</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[100px]">CERTIFICADO<br/>FITO</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[100px]">LAUDO<br/>PRAGAS</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[100px]">CERTIFICADO<br/>FUMIGAÇÃO</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[100px]">CERTIFICADO<br/>SUPERVISORA</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[100px]">INVOICE<br/>(FERRARI)</th>
                  <th className="border border-primary-foreground/20 px-2 min-w-[100px]">PACKING LIST<br/>(FERRARI)</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={16} className="px-4 py-8 text-center bg-background">
                      <div className='flex justify-center items-center gap-2'>
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm">Carregando processos...</span>
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
                      {/* 1. IDENTIFICAÇÃO */}
                      <td className="border-r border-primary/10 px-2 py-1 align-middle bg-accent/5">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{processo.processo_interno}</span>
                          <span className="text-[9px] uppercase truncate max-w-[110px]">{processo.exportadorNome}</span>
                          <span className="text-[9px] text-blue-600 font-bold">{processo.analistaNome || 'SEM ANALISTA'}</span>
                        </div>
                      </td>
                      {/* 2. LOGÍSTICA */}
                      <td className="border-r border-primary/10 px-2 py-1 align-middle">
                        <div className="flex flex-col gap-0.5">
                          <span className="truncate max-w-[120px]">{processo.navio || 'SEM NAVIO'}</span>
                          <span className="text-[8px] text-muted-foreground font-normal">ETD: {formatDate(processo.etd)}</span>
                          <span className="text-[8px] text-muted-foreground font-normal">ETA: {formatDate(processo.eta)}</span>
                        </div>
                      </td>
                      {/* 3. AÇÕES */}
                      <td className="border-r border-primary/10 px-2 py-1 text-center align-middle bg-accent/5">
                        <div className="flex gap-1 justify-center">
                          <Link href={`/dashboard/processos/novo?id=${processo.id}&edit=true`}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/10">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          {processo.exportadorId && (
                            <Link href={`/portal/${processo.exportadorId}`} target="_blank">
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600">
                                <Globe className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
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
                      {/* 4. DEAD LINE */}
                      <td className="border-r border-primary/10 p-0">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="flex justify-between px-2 py-1.5 italic"><span>DRAFT</span> <span className="text-destructive font-bold ml-2">{formatDate(processo.deadline_draft)}</span></div>
                          <div className="flex justify-between px-2 py-1.5 italic"><span>VGM</span> <span className="text-destructive font-bold ml-2">{formatDate(processo.deadline_vgm)}</span></div>
                          <div className="flex justify-between px-2 py-1.5 italic"><span>CARGA</span> <span className="text-destructive font-bold ml-2">{formatDate(processo.deadline_carga)}</span></div>
                        </div>
                      </td>
                      {/* 5. STATUS */}
                      <td className="border-r border-primary/10 px-2 py-1 text-center font-bold uppercase align-middle">
                        <Badge variant={getStatusVariant(processo.status)} className="text-[9px] px-1 h-5 w-full justify-center">
                          {processo.status || 'N/A'}
                        </Badge>
                      </td>
                      {/* 6. DADOS CONTAINERS / NOTAS */}
                      <td className="border-r border-primary/10 p-0">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="flex justify-between px-2 py-1.5 italic"><span>CONTAINERS</span> <span className="text-destructive font-bold ml-2">{processo.containers?.length > 0 ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                          <div className="flex justify-between px-2 py-1.5 italic"><span>REMESSA</span> <span className="text-destructive font-bold ml-2">{getNFDate('Remessa')}</span></div>
                          <div className="flex justify-between px-2 py-1.5 italic"><span>EXPORTAÇÃO</span> <span className="text-destructive font-bold ml-2">{getNFDate('Exportação')}</span></div>
                        </div>
                      </td>
                      {/* 7. LPCO / INSPEÇÃO / TRATAMENTO */}
                      <td className="border-r border-primary/10 p-0">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="flex justify-between px-2 py-1.5 italic"><span>LPCO</span> <span className="text-muted-foreground font-bold ml-2">{processo.lpco_protocolo || '---'}</span></div>
                          <div className="flex justify-between px-2 py-1.5 italic"><span>INSPEÇÃO</span> <span className="text-destructive font-bold ml-2">{processo.mapa_status?.includes('DEFERIDA') ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                          <div className="flex justify-between px-2 py-1.5 italic"><span>TRATAMENTO</span> <span className="text-destructive font-bold ml-2">{fumigacao.date}</span></div>
                        </div>
                      </td>
                      {/* 8. DUE / DESEMBARAÇO / AVERBAÇÃO */}
                      <td className="border-r border-primary/10 p-0">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="flex justify-between px-2 py-1.5 italic"><span>DUE</span> <span className="text-muted-foreground font-bold ml-2 truncate max-w-[80px]">{processo.due_numero || '---'}</span></div>
                          <div className="flex justify-between px-2 py-1.5 italic"><span>DESEMBARAÇO</span> <span className="text-destructive font-bold ml-2">{processo.due_status?.includes('DESEMBARAÇADA') ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                          <div className="flex justify-between px-2 py-1.5 italic"><span>AVERBADA</span> <span className="text-destructive font-bold ml-2">{processo.due_status === 'AVERBADA' ? formatDate(processo.data_nomeacao) : '---'}</span></div>
                        </div>
                      </td>
                      {/* 9. BL */}
                      <td className="border-r border-primary/10 p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-1.5 uppercase text-primary font-bold">{bl.status}</div>
                          <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{bl.action}</div>
                          <div className="py-1.5 text-destructive font-bold">{bl.date}</div>
                        </div>
                      </td>
                      {/* 10. CERT ORIGEM */}
                      <td className="border-r border-primary/10 p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-1.5 uppercase text-primary font-bold">{origem.status}</div>
                          <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{origem.action}</div>
                          <div className="py-1.5 text-destructive font-bold">{origem.date}</div>
                        </div>
                      </td>
                      {/* 11. CERT FITO */}
                      <td className="border-r border-primary/10 p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-1.5 uppercase text-primary font-bold">{fito.status}</div>
                          <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{fito.action}</div>
                          <div className="py-1.5 text-destructive font-bold">{fito.date}</div>
                        </div>
                      </td>
                      {/* 12. LAUDO PRAGAS */}
                      <td className="border-r border-primary/10 p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-1.5 uppercase text-primary font-bold">{pragas.status}</div>
                          <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{pragas.action}</div>
                          <div className="py-1.5 text-destructive font-bold">{pragas.date}</div>
                        </div>
                      </td>
                      {/* 13. CERT FUMIGACAO */}
                      <td className="border-r border-primary/10 p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-1.5 uppercase text-primary font-bold">{fumigacao.status}</div>
                          <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{fumigacao.action}</div>
                          <div className="py-1.5 text-destructive font-bold">{fumigacao.date}</div>
                        </div>
                      </td>
                      {/* 14. CERT SUPERVISORA */}
                      <td className="border-r border-primary/10 p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-1.5 uppercase text-primary font-bold">{supervisora.status}</div>
                          <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{supervisora.action}</div>
                          <div className="py-1.5 text-destructive font-bold">{supervisora.date}</div>
                        </div>
                      </td>
                      {/* 15. INVOICE */}
                      <td className="border-r border-primary/10 p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-1.5 uppercase text-primary font-bold">{invoice.status}</div>
                          <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{invoice.action}</div>
                          <div className="py-1.5 text-destructive font-bold">{invoice.date}</div>
                        </div>
                      </td>
                      {/* 16. PACKING LIST */}
                      <td className="border-r border-primary/10 p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-1.5 uppercase text-primary font-bold">{packing.status}</div>
                          <div className="py-1.5 uppercase text-destructive font-bold leading-tight">{packing.action}</div>
                          <div className="py-1.5 text-destructive font-bold">{packing.date}</div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!isLoading && filteredProcessos.length === 0 && (
                  <tr>
                    <td colSpan={16} className="px-4 py-8 text-center text-muted-foreground bg-background">Nenhum processo encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Botão Flutuante Novo Processo */}
      <Link href="/dashboard/processos/novo" passHref>
        <Button className="fixed bottom-8 right-8 rounded-full shadow-2xl h-14 w-14 p-0 md:h-auto md:w-auto md:px-6 md:py-4 z-50 transition-transform hover:scale-105 active:scale-95">
          <PlusCircle className="h-6 w-6 md:mr-2" />
          <span className="hidden md:inline font-bold">Novo Processo</span>
        </Button>
      </Link>
    </div>
  );
}
