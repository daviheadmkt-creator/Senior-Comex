'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { format } from 'date-fns';
import { useSearch } from '@/components/search-provider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Formata uma data de forma robusta, lidando com Timestamps do Firebase, Strings ISO ou Objetos Date.
 */
const formatDate = (dateInput: any, includeTime: boolean = false) => {
  if (!dateInput) return '---';
  
  let date: Date;
  
  try {
    // Caso seja um Timestamp do Firebase (possui propriedade seconds)
    if (dateInput && typeof dateInput === 'object' && 'seconds' in dateInput) {
      date = new Date(dateInput.seconds * 1000);
    } 
    // Caso seja uma instância de Date
    else if (dateInput instanceof Date) {
      date = dateInput;
    } 
    // Caso seja string ou número
    else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return '---';
    return format(date, includeTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy');
  } catch (err) {
    return '---';
  }
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return 'outline';
  const lowerStatus = status.toLowerCase();
  if (
    lowerStatus.includes('embarcado') ||
    lowerStatus.includes('aprovados') ||
    lowerStatus.includes('desembaraçada') ||
    lowerStatus.includes('deferida') ||
    lowerStatus.includes('liberado') ||
    lowerStatus.includes('averbada') ||
    lowerStatus.includes('concluído') ||
    lowerStatus.includes('set doc enviado')
  ) return 'default';
  if (lowerStatus.includes('recebida') || lowerStatus.includes('registrada')) return 'outline';
  if (
    lowerStatus.includes('aguardando') ||
    lowerStatus.includes('em analise') ||
    lowerStatus.includes('em aprovação')
  ) return 'secondary';
  if (
    lowerStatus.includes('exigencia') ||
    lowerStatus.includes('cancelado') ||
    lowerStatus.includes('indeferida') ||
    lowerStatus.includes('rejeitado')
  ) return 'destructive';
  return 'outline';
};

export default function GestaoProcessosPage() {
  const { searchTerm, setSearchTerm } = useSearch();
  const firestore = useFirestore();

  const processosCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'processos') : null),
    [firestore]
  );
  const { data: processos, isLoading } = useCollection(processosCollection);

  const handleDelete = (id: string) => {
    if (!firestore) return;
    deleteDocumentNonBlocking(doc(firestore, 'processos', id));
  };

  const filteredProcessos = useMemo(() => {
    if (!processos) return [];
    const term = searchTerm.toLowerCase();

    return [...processos]
      .sort((a, b) => (b.processo_interno || '').localeCompare(a.processo_interno || ''))
      .filter(processo => {
        const searchFields = [
          processo.processo_interno,
          processo.exportadorNome,
          processo.analistaNome,
          processo.po_number,
          processo.produtoNome,
          processo.booking_number,
          processo.armadorNome,
          processo.navio,
          processo.portoEmbarqueNome,
          processo.portoDescargaNome,
          processo.destino,
          processo.terminalDespachoNome,
          processo.terminalEmbarqueNome
        ];

        return searchFields.some(field =>
          field && String(field).toLowerCase().includes(term)
        );
      });
  }, [processos, searchTerm]);

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-120px)]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestão de Processos (Follow-up)</h1>
          <p className="text-muted-foreground">
            Acompanhamento técnico e operacional detalhado de todos os processos.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-primary/20 shadow-lg">
        <CardHeader className="pb-3 border-b bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="relative w-full max-sm:max-w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar Analista, PO, Produto, Navio, Origem..."
                className="pl-8 bg-background border-primary/20"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                type="search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[calc(100vh-280px)]">
            <table className="w-full border-collapse text-[10px] relative">
              <thead className="sticky top-0 z-30">
                <tr className="bg-primary text-white text-center h-12 uppercase font-bold divide-x divide-white/10">
                  <th className="px-2 min-w-[80px] sticky left-0 z-40 bg-primary">AÇÕES</th>
                  <th className="px-2 min-w-[90px] sticky left-[80px] z-40 bg-primary">ANALISTA</th>
                  <th className="px-2 min-w-[120px] sticky left-[170px] z-40 bg-primary shadow-md">PO / CLIENTE</th>
                  <th className="px-2 min-w-[120px]">PRODUTO / DATA NOMEAÇÃO</th>
                  <th className="px-2 min-w-[120px]">RESERVA / AGÊNCIA / ARMADOR</th>
                  <th className="px-2 min-w-[120px]">NAVIO / VIAGEM</th>
                  <th className="px-2 min-w-[100px]">ORIGEM / ETD</th>
                  <th className="px-2 min-w-[100px]">DESTINO / ETA</th>
                  <th className="px-2 min-w-[90px]">CTR / KGS</th>
                  <th className="px-2 min-w-[140px]">DEAD LINE / PRAZO</th>
                  <th className="px-2 min-w-[130px]">REMARK (STATUS)</th>
                  <th className="px-2 min-w-[150px]">ARMAZÉM / TERMINAIS</th>
                  <th className="px-2 min-w-[150px]">CONTAINERS / NOTAS FISCAIS</th>
                  <th className="px-2 min-w-[150px]">LPCO / INSPEÇÃO (MAPA)</th>
                  <th className="px-2 min-w-[150px]">DUE / DESEMBARAÇO</th>
                  <th className="px-2 min-w-[80px]">BL</th>
                  <th className="px-2 min-w-[80px]">CERT. ORIGEM</th>
                  <th className="px-2 min-w-[80px]">CERT. FITO</th>
                  <th className="px-2 min-w-[80px]">LAUDO PRAGAS</th>
                  <th className="px-2 min-w-[80px]">CERT. FUMIG.</th>
                  <th className="px-2 min-w-[80px]">CERT. SUPERV.</th>
                  <th className="px-2 min-w-[80px]">INVOICE</th>
                  <th className="px-2 min-w-[80px]">PACKING LIST</th>
                  <th className="px-2 min-w-[100px]">REF. SENIOR</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {isLoading && (
                  <tr>
                    <td colSpan={24} className="px-4 py-8 text-center bg-background">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm font-medium italic">Sincronizando dados em tempo real...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && filteredProcessos.map((processo) => {
                  // Definição de flags de arquivos para as colunas automatizadas
                  const hasDraftFile = !!(processo.deadline_draft_file?.downloadURL || processo.draft_bl_file?.downloadURL);
                  const hasVgmFile = !!processo.deadline_vgm_file?.downloadURL;
                  const hasCargaFile = !!processo.deadline_carga_file?.downloadURL;

                  const remessaNF = (processo.notas_fiscais || []).find((n: any) => n.tipo === 'Remessa');
                  const exportacaoNF = (processo.notas_fiscais || []).find((n: any) => n.tipo === 'Exportação');
                  const hasRemessaFile = !!remessaNF?.file?.downloadURL;
                  const hasExportacaoFile = !!exportacaoNF?.file?.downloadURL;

                  const lpcoDoc = (processo.documentos_fiscais || []).find((d: any) => d.tipo === 'LPCO');
                  const hasLpcoFile = !!lpcoDoc?.file?.downloadURL;

                  const dueDoc = (processo.documentos_fiscais || []).find((d: any) => d.tipo === 'DUE');
                  const hasDueFile = !!dueDoc?.file?.downloadURL;

                  const tratamentoDoc = (processo.documentos_fiscais || []).find((d: any) => d.tipo === 'TRATAMENTO');
                  const hasTratamentoFile = !!tratamentoDoc?.file?.downloadURL;

                  const renderDocCell = (keywords: string[], fallbackFile?: any) => {
                    const docsList = processo.documentos_pos_embarque || [];
                    const docItem = docsList.find((d: any) => {
                      const name = String(d.nome || d.type || '').toUpperCase();
                      return keywords.some(k => name === k.toUpperCase() || name.includes(k.toUpperCase()));
                    });

                    const fileObj = docItem?.file || fallbackFile;

                    if (fileObj && fileObj.downloadURL) {
                      const dateToFormat = docItem?.data_liberacao || docItem?.data_emissao || processo.data_nomeacao;
                      return (
                        <div className="flex flex-col items-center justify-center h-full py-1 text-center font-bold">
                          <div className="text-blue-600 text-[10px]">APROVADO</div>
                          <div className="text-red-600 text-[10px]">RECEBIDO</div>
                          <div className="text-black font-normal text-[9px]">{formatDate(dateToFormat)}</div>
                        </div>
                      );
                    }

                    return <div className="py-4 text-muted-foreground text-center">---</div>;
                  };

                  return (
                    <tr key={processo.id} className="text-primary font-bold border-b border-primary/10 hover:bg-gray-50 transition-colors divide-x divide-primary/10 h-16">
                      <td className="px-2 py-1 text-center sticky left-0 z-10 bg-white">
                        <div className="flex gap-1 justify-center">
                          <Link href={`/dashboard/processos/novo?id=${processo.id}&edit=true`}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/10">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          {processo.exportadorId && (
                            <Link href={`/portal/${processo.exportadorId}`} target="_blank">
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600 hover:bg-blue-50">
                                <Globe className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-red-50">
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
                                <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => handleDelete(processo.id)}>Confirmar Exclusão</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>

                      <td className="px-2 py-1 text-center text-blue-700 uppercase sticky left-[80px] z-10 bg-white border-r">
                        {processo.analistaNome || '---'}
                      </td>

                      <td className="px-2 py-1 sticky left-[170px] z-10 bg-white shadow-md border-r">
                        <div className="flex flex-col">
                          <span className="text-red-600 font-black">{processo.po_number || '---'}</span>
                          <span className="text-[9px] uppercase truncate text-gray-600">{processo.exportadorNome}</span>
                        </div>
                      </td>

                      <td className="px-2 py-1 text-center">
                        <div className="flex flex-col">
                          <span className="uppercase text-gray-800">{processo.produtoNome || '---'}</span>
                          <span className="text-[9px] font-normal text-muted-foreground">{formatDate(processo.data_nomeacao)}</span>
                        </div>
                      </td>

                      <td className="px-2 py-1 text-center">
                        <div className="flex flex-col">
                          <span className="text-gray-800">{processo.booking_number || '---'}</span>
                          <span className="text-[9px] font-normal text-muted-foreground uppercase">{processo.armadorNome || '---'}</span>
                        </div>
                      </td>

                      <td className="px-2 py-1 text-center truncate max-w-[120px] uppercase text-gray-800">
                        {processo.navio || '---'}
                      </td>

                      <td className="px-2 py-1 text-center">
                        <div className="flex flex-col">
                          <span className="text-red-600 font-bold">{processo.portoEmbarqueNome || '---'}</span>
                          <span className="text-[9px] font-normal text-muted-foreground">{formatDate(processo.etd)}</span>
                        </div>
                      </td>

                      <td className="px-2 py-1 text-center">
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-bold">{processo.portoDescargaNome || '---'}</span>
                          <span className="text-[9px] font-normal text-muted-foreground">{formatDate(processo.eta)}</span>
                          <span className="text-blue-600 font-bold uppercase">{processo.destino || '---'}</span>
                        </div>
                      </td>

                      <td className="px-2 py-1 text-center">
                        <div className="flex flex-col">
                          <span className="text-gray-800 uppercase">{processo.quantidade_escrito_ctr || (processo.containers?.length ? `${processo.containers.length} CTR` : '---')}</span>
                          <span className="text-[9px] font-normal text-muted-foreground">{processo.quantidade || '---'}</span>
                        </div>
                      </td>

                      <td className="p-0 border-r border-primary/10">
                        <div className="flex justify-between px-2 py-1">
                          <span>DRAFT</span>
                          <span className={cn("font-bold", hasDraftFile ? "text-green-600 font-black" : "text-red-600")}>
                            {hasDraftFile ? "OK" : formatDate(processo.deadline_draft, true)}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-1 border-t border-primary/10">
                          <span>VGM</span>
                          <span className={cn("font-bold", hasVgmFile ? "text-green-600 font-black" : "text-red-600")}>
                            {hasVgmFile ? "OK" : formatDate(processo.deadline_vgm, true)}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-1 border-t border-primary/10">
                          <span>CARGA</span>
                          <span className={cn("font-bold", hasCargaFile ? "text-green-600 font-black" : "text-red-600")}>
                            {hasCargaFile ? "OK" : formatDate(processo.deadline_carga, true)}
                          </span>
                        </div>
                      </td>

                      <td className="px-2 py-1 text-center align-middle">
                        <Badge variant={getStatusVariant(processo.status)} className="text-[9px] px-1 h-6 w-full justify-center shadow-sm">
                          {processo.status || 'N/A'}
                        </Badge>
                      </td>

                      <td className="p-0 border-r border-primary/10">
                        <div className="grid grid-rows-3 h-full divide-y divide-gray-100 uppercase text-[9px]">
                          <div className="px-2 py-1 flex justify-between"><span>ARMAZÉM</span> <span className="truncate max-w-[80px] text-gray-700">{processo.viagem || '---'}</span></div>
                          <div className="px-2 py-1 flex justify-between"><span>EMBARQUE</span> <span className="truncate max-w-[80px] text-gray-700 font-medium">{processo.terminalDespachoNome || '---'}</span></div>
                          <div className="px-2 py-1 flex justify-between"><span>DESCARGA</span> <span className="truncate max-w-[80px] text-gray-700 font-medium">{processo.terminalEmbarqueNome || '---'}</span></div>
                        </div>
                      </td>

                      <td className="p-0 border-r border-primary/10">
                        <div className="flex justify-between px-2 py-1 italic">
                          <span>CONTAINERS</span>
                          <span className="text-destructive font-bold">
                            {formatDate(processo.data_containers)}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-1 border-t border-primary/10">
                          <span>REMESSA</span>
                          <span className={cn("font-bold", hasRemessaFile ? "text-green-600 font-black" : "text-red-600")}>
                            {hasRemessaFile ? "OK" : formatDate(remessaNF?.data_recebida)}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-1 border-t border-primary/10">
                          <span>EXPORTAÇÃO</span>
                          <span className={cn("font-bold", hasExportacaoFile ? "text-green-600 font-black" : "text-red-600")}>
                            {hasExportacaoFile ? "OK" : formatDate(exportacaoNF?.data_recebida)}
                          </span>
                        </div>
                      </td>

                      <td className="p-0 border-r border-primary/10">
                        <div className="flex justify-between px-2 py-1">
                          <span>LPCO</span>
                          <span className={cn("font-bold", hasLpcoFile ? "text-green-600 font-black" : "text-red-600")}>
                            {hasLpcoFile ? "OK" : (lpcoDoc?.identificacao || "---")}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-1 border-t border-primary/10">
                          <span>INSPEÇÃO</span>
                          <span className="text-red-600 font-bold">
                            {formatDate(lpcoDoc?.data)}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-1 border-t border-primary/10">
                          <span>TRATAMENTO</span>
                          <span className="text-red-600 font-bold">
                            {formatDate(tratamentoDoc?.data)}
                          </span>
                        </div>
                      </td>

                      <td className="p-0 border-r border-primary/10">
                        <div className="flex justify-between px-2 py-1">
                          <span>DUE</span>
                          <span className={cn("font-bold", hasDueFile ? "text-green-600 font-black" : "text-red-600")}>
                            {hasDueFile ? "OK" : (dueDoc?.identificacao || "---")}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-1 border-t border-primary/10">
                          <span>DESEMBARAÇO</span>
                          <span className="text-red-600 font-bold">
                            {formatDate(dueDoc?.data)}
                          </span>
                        </div>
                        <div className="flex justify-between px-2 py-1 border-t border-primary/10">
                          <span>AVERBAÇÃO</span>
                          <span className="text-red-600 font-bold">
                            {dueDoc?.status === 'AVERBADA' ? formatDate(dueDoc?.data) : "---"}
                          </span>
                        </div>
                      </td>

                      <td className="p-0 border-r border-primary/10">{renderDocCell(['BL', 'BILL OF LADING', 'B.L.'], processo.draft_bl_file)}</td>
                      <td className="p-0 border-r border-primary/10">{renderDocCell(['ORIGEM', 'C.O.', 'ORIGIN', 'CERTIFICADO DE ORIGEM'], processo.draft_co_file)}</td>
                      <td className="p-0 border-r border-primary/10">{renderDocCell(['FITO', 'PHYTOSANITARY', 'FITOSSANITARIO', 'CERTIFICADO FITOSSANITARIO'], processo.draft_fito_file)}</td>
                      <td className="p-0 border-r border-primary/10">{renderDocCell(['HEALTH', 'PRAGAS', 'SAUDE', 'SANITARY', 'LAUDO PRAGAS'])}</td>
                      <td className="p-0 border-r border-primary/10">{renderDocCell(['FUMIGATION', 'FUMIGACAO', 'FUMIG.'])}</td>
                      <td className="p-0 border-r border-primary/10">{renderDocCell(['QUALITY', 'QUALIDADE', 'SUPERV.', 'SUPERVISORA'])}</td>
                      <td className="p-0 border-r border-primary/10">{renderDocCell(['INVOICE', 'FATURA', 'INV'])}</td>
                      <td className="p-0 border-r border-primary/10">{renderDocCell(['PACKING', 'P.L.', 'LIST', 'PACKING LIST'])}</td>

                      <td className="px-2 py-1 text-center text-[9px] text-muted-foreground uppercase border-l">
                        {processo.processo_interno || '---'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Link href="/dashboard/processos/novo" passHref>
        <button className="fixed bottom-8 right-8 rounded-full shadow-2xl h-14 w-14 flex items-center justify-center bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-transform z-50">
          <PlusCircle className="h-6 w-6" />
        </button>
      </Link>
    </div>
  );
}
