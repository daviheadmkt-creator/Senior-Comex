'use client';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Pencil, Trash2, Loader2, Globe, CheckCircle2 } from 'lucide-react';
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

/**
 * Formata uma string de data ISO para o padrão brasileiro.
 * @param dateString A string de data ISO ou objeto Date.
 * @param includeTime Se true, inclui o horário (HH:mm).
 */
const formatDate = (dateString: any, includeTime: boolean = false) => {
    if (!dateString || dateString === '---') return '---';
    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        if (isNaN(date.getTime())) return '---';
        return format(date, includeTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy');
    } catch {
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

  const processosCollection = useMemoFirebase(() => firestore ? collection(firestore, 'processos') : null, [firestore]);
  const { data: processos, isLoading } = useCollection(processosCollection);

  const handleDelete = (id: string) => {
    if(!firestore) return;
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

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                  placeholder="Buscar Analista, PO, Produto, Navio, Origem..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  type="search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[calc(100vh-280px)]">
            <table className="w-full border-collapse border border-primary/20 text-[9px] relative">
              <thead className="sticky top-0 z-30">
                <tr className="bg-primary text-primary-foreground text-center h-12 uppercase font-bold divide-x divide-primary-foreground/20">
                  <th className="px-2 min-w-[80px] w-[80px] sticky left-0 z-40 bg-primary">AÇÕES</th>
                  <th className="px-2 min-w-[90px] w-[90px] sticky left-[80px] z-40 bg-primary">ANALISTA</th>
                  <th className="px-2 min-w-[120px] w-[120px] sticky left-[170px] z-40 bg-primary shadow-[2px_0_5_rgba(0,0,0,0.1)]">PO / CLIENTE</th>
                  <th className="px-2 min-w-[120px]">PRODUTO / DATA NOMEAÇÃO</th>
                  <th className="px-2 min-w-[120px]">RESERVA / AGÊNCIA / ARMADOR</th>
                  <th className="px-2 min-w-[120px]">NAVIO / VIAGEM</th>
                  <th className="px-2 min-w-[100px]">ORIGEM / ETD</th>
                  <th className="px-2 min-w-[100px]">DESTINO / ETA</th>
                  <th className="px-2 min-w-[90px]">CONTAINERS / KGS</th>
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
              <tbody className="bg-background">
                {isLoading && (
                  <tr>
                    <td colSpan={24} className="px-4 py-8 text-center bg-background">
                      <div className='flex justify-center items-center gap-2'>
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm font-medium">Carregando dados da planilha...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && filteredProcessos.map((processo) => {
                  const getDocStatus = (name: string) => {
                    const docsList = processo.documentos_pos_embarque || [];
                    const docItem = docsList.find((d: any) => String(d.nome || '').toUpperCase() === name.toUpperCase());
                    
                    let action = '---';
                    let displayDate = '---';

                    if (docItem) {
                      if (docItem.data_liberacao) {
                        action = (name === 'BL') ? 'LIBERADO/TELEX' : 'LIBERADO';
                        displayDate = formatDate(docItem.data_liberacao);
                      } else if (docItem.data_emissao) {
                        action = 'EMITIDO';
                        displayDate = formatDate(docItem.data_emissao);
                      } else {
                        action = 'RECEBIDO';
                      }
                    }

                    return {
                      status: docItem ? 'APROVADO' : '---',
                      action,
                      date: displayDate
                    };
                  };

                  const getNFDate = (type: string) => {
                    const nfList = processo.notas_fiscais || [];
                    const nf = nfList.find((n: any) => n.tipo === type);
                    if (!nf) return '---';
                    const received = formatDate(nf.data_recebida);
                    const requested = formatDate(nf.data_pedido);
                    return received !== '---' ? received : requested;
                  };

                  const docs = {
                    bl: getDocStatus('BL'),
                    origem: getDocStatus('ORIGEM'),
                    fito: getDocStatus('FITO'),
                    health: getDocStatus('HEALTH'), // LAUDO PRAGAS
                    fumigation: getDocStatus('FUMIGATION'), // CERT. FUMIG.
                    quality: getDocStatus('QUALITY'), // CERT. SUPERV.
                    invoice: getDocStatus('INVOICE'),
                    packing: getDocStatus('PACKING LIST'),
                  };

                  const fiscalDocs = processo.documentos_fiscais || [];
                  
                  // LPCO / Inspeção
                  const fiscalLPCO = fiscalDocs.find((df: any) => String(df.tipo || '').toUpperCase() === 'LPCO');
                  const inspecaoDate = fiscalLPCO?.data ? formatDate(fiscalLPCO.data) : '---';
                  const lpcoIdent = fiscalLPCO?.identificacao || '---';
                  
                  // Desembaraço: procura por status DESEMBARAÇADA ou AVERBADA
                  const dueDocs = fiscalDocs.filter((df: any) => String(df.tipo || '').toUpperCase() === 'DUE');
                  const desembaraçoDoc = dueDocs.find((df: any) => 
                    String(df.status || '').toUpperCase().includes('DESEMBARAÇADA') || 
                    String(df.status || '').toUpperCase().includes('AVERBADA')
                  );
                  const averbacaoDoc = dueDocs.find((df: any) => 
                    String(df.status || '').toUpperCase().includes('AVERBADA')
                  );
                  
                  const dueIdent = dueDocs[0]?.identificacao || '---';
                  const desembaraçoDate = desembaraçoDoc?.data ? formatDate(desembaraçoDoc.data) : '---';
                  const averbacaoDate = averbacaoDoc?.data ? formatDate(averbacaoDoc.data) : '---';
                  
                  // Tratamento
                  const treatmentDoc = fiscalDocs.find((df: any) => String(df.tipo || '').toUpperCase() === 'TRATAMENTO');
                  const treatmentDate = treatmentDoc?.data ? formatDate(treatmentDoc.data) : '---';

                  const isDraftOk = !!(processo.draft_bl_file?.downloadURL || processo.deadline_draft_file?.downloadURL);
                  const isVGMOk = !!(processo.deadline_vgm_file?.downloadURL);
                  const isCargaOk = !!(processo.deadline_carga_file?.downloadURL);

                  return (
                    <tr key={processo.id} className="bg-card text-primary font-bold border-b border-primary/10 hover:bg-accent/5 transition-colors divide-x divide-primary/10 h-16">
                      <td className="px-2 py-1 text-center sticky left-0 z-10 bg-card">
                        <div className="flex gap-1 justify-center">
                          <Link href={`/dashboard/processos/novo?id=${processo.id}&edit=true`}>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary">
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </Link>
                          {processo.exportadorId && (
                            <Link href={`/portal/${processo.exportadorId}`} target="_blank">
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600">
                                <Globe className="h-3 w-3" />
                              </Button>
                            </Link>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Processo</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Excluir o processo {processo.processo_interno}? Ação irreversível.
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

                      <td className="px-2 py-1 text-center text-blue-600 uppercase sticky left-[80px] z-10 bg-card">{processo.analistaNome || '---'}</td>
                      
                      <td className="px-2 py-1 sticky left-[170px] z-10 bg-card shadow-[2px_0_5_rgba(0,0,0,0.05)] border-r">
                        <div className="flex flex-col">
                          <span className="text-destructive font-extrabold">{processo.po_number || '---'}</span>
                          <span className="text-[8px] uppercase truncate">{processo.exportadorNome}</span>
                        </div>
                      </td>

                      <td className="px-2 py-1">
                        <div className="flex flex-col">
                          <span className="uppercase text-foreground">{processo.produtoNome || '---'}</span>
                          <span className="text-[8px] font-normal text-muted-foreground">{formatDate(processo.data_nomeacao)}</span>
                        </div>
                      </td>

                      <td className="px-2 py-1">
                        <div className="flex flex-col">
                          <span className="text-foreground">{processo.booking_number || '---'}</span>
                          <span className="text-[8px] font-normal text-muted-foreground uppercase">{processo.armadorNome || '---'}</span>
                        </div>
                      </td>

                      <td className="px-2 py-1 truncate max-w-[120px] uppercase text-foreground">{processo.navio || '---'}</td>

                      <td className="px-2 py-1 text-center">
                        <div className="flex flex-col">
                          <span className="text-destructive font-bold">{processo.portoEmbarqueNome || '---'}</span>
                          <div className="flex flex-col text-[7px] text-muted-foreground uppercase leading-tight">
                            <span>ETD: {formatDate(processo.etd)}</span>
                            <span className="text-primary/70 italic">CHEG: {formatDate(processo.data_chegada_embarque)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-2 py-1 text-center">
                        <div className="flex flex-col">
                          <span className="text-foreground font-bold">{processo.portoDescargaNome || '---'}</span>
                          <div className="flex flex-col text-[7px] text-muted-foreground uppercase leading-tight">
                            <span>ETA: {formatDate(processo.eta)}</span>
                            <span className="italic">CHEG: {formatDate(processo.data_chegada_descarga)}</span>
                            <div className="mt-1 pt-1 border-t border-primary/5 flex flex-col">
                               <span className="text-blue-600 font-extrabold truncate max-w-[100px]">{processo.destino || '---'}</span>
                               <span className="text-[6px] italic">DEST: {formatDate(processo.data_chegada_destino)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-2 py-1 text-center">
                        <div className="flex flex-col">
                          <span className="text-foreground">{processo.containers?.length || 0} CTR</span>
                          <span className="text-[8px] font-normal text-muted-foreground">{processo.quantidade || '---'}</span>
                        </div>
                      </td>

                      <td className="p-0">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="flex justify-between px-2 py-0.5 italic items-center gap-1">
                            <span>DRAFT</span> 
                            <div className="flex items-center gap-1">
                                <span className={cn(isDraftOk ? "text-green-600 font-extrabold" : "text-destructive font-bold")}>
                                  {formatDate(processo.deadline_draft, true)}
                                </span>
                                {isDraftOk && <CheckCircle2 className="h-2 w-2 text-green-600" />}
                            </div>
                          </div>
                          <div className="flex justify-between px-2 py-0.5 italic items-center gap-1">
                            <span>VGM</span> 
                            <div className="flex items-center gap-1">
                                <span className={cn(isVGMOk ? "text-green-600 font-extrabold" : "text-destructive font-bold")}>
                                  {formatDate(processo.deadline_vgm, true)}
                                </span>
                                {isVGMOk && <CheckCircle2 className="h-2 w-2 text-green-600" />}
                            </div>
                          </div>
                          <div className="flex justify-between px-2 py-0.5 italic items-center gap-1">
                            <span>CARGA</span> 
                            <div className="flex items-center gap-1">
                                <span className={cn(isCargaOk ? "text-green-600 font-extrabold" : "text-destructive font-bold")}>
                                  {formatDate(processo.deadline_carga, true)}
                                </span>
                                {isCargaOk && <CheckCircle2 className="h-2 w-2 text-green-600" />}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-2 py-1 text-center align-middle">
                        <Badge variant={getStatusVariant(processo.status)} className="text-[8px] px-1 h-5 w-full justify-center">
                          {processo.status || 'N/A'}
                        </Badge>
                      </td>

                      <td className="p-0">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted uppercase text-[8px]">
                          <div className="px-2 py-0.5 flex justify-between"><span>ARMAZÉM</span> <span className="truncate max-w-[80px] text-foreground">{processo.viagem || '---'}</span></div>
                          <div className="px-2 py-0.5 flex justify-between"><span>EMBARQUE</span> <span className="truncate max-w-[80px] text-foreground">{processo.terminalDespachoNome || '---'}</span></div>
                          <div className="px-2 py-0.5 flex justify-between"><span>DESCARGA</span> <span className="truncate max-w-[80px] text-foreground">{processo.terminalEmbarqueNome || '---'}</span></div>
                        </div>
                      </td>

                      <td className="p-0">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted italic">
                          <div className="flex justify-between px-2 py-0.5">
                            <span>CONTAINERS</span> 
                            <span className={cn(
                              "font-bold",
                              processo.containers?.length > 0 ? "text-primary" : "text-destructive"
                            )}>
                              {processo.containers?.length > 0 ? formatDate(processo.data_containers) : '---'}
                            </span>
                          </div>
                          <div className="flex justify-between px-2 py-0.5"><span>REMESSA</span> <span className="text-destructive font-bold">{getNFDate('Remessa')}</span></div>
                          <div className="flex justify-between px-2 py-0.5"><span>EXPORTAÇÃO</span> <span className="text-destructive font-bold">{getNFDate('Exportação')}</span></div>
                        </div>
                      </td>

                      <td className="p-0">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted italic">
                          <div className="flex justify-between px-2 py-0.5"><span>LPCO</span> <span className="text-muted-foreground font-bold">{lpcoIdent}</span></div>
                          <div className="flex justify-between px-2 py-0.5"><span>INSPEÇÃO</span> <span className="text-destructive font-bold">{inspecaoDate}</span></div>
                          <div className="flex justify-between px-2 py-0.5"><span>TRATAMENTO</span> <span className="text-destructive font-bold">{treatmentDate}</span></div>
                        </div>
                      </td>

                      <td className="p-0">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted italic">
                          <div className="flex justify-between px-2 py-0.5"><span>DUE</span> <span className="text-muted-foreground font-bold truncate max-w-[110px] uppercase">{dueIdent}</span></div>
                          <div className="flex justify-between px-2 py-0.5"><span>DESEMBARAÇO</span> <span className="text-destructive font-bold">{desembaraçoDate}</span></div>
                          <div className="flex justify-between px-2 py-0.5"><span>AVERBAÇÃO</span> <span className="text-destructive font-bold">{averbacaoDate}</span></div>
                        </div>
                      </td>

                      <td className="p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-0.5 text-primary">{docs.bl.status}</div>
                          <div className="py-0.5 text-destructive leading-none text-[7px]">{docs.bl.action}</div>
                          <div className="py-0.5 text-destructive">{docs.bl.date}</div>
                        </div>
                      </td>
                      <td className="p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-0.5 text-primary">{docs.origem.status}</div>
                          <div className="py-0.5 text-destructive leading-none text-[7px]">{docs.origem.action}</div>
                          <div className="py-0.5 text-destructive">{docs.origem.date}</div>
                        </div>
                      </td>
                      <td className="p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-0.5 text-primary">{docs.fito.status}</div>
                          <div className="py-0.5 text-destructive leading-none text-[7px]">{docs.fito.action}</div>
                          <div className="py-0.5 text-destructive">{docs.fito.date}</div>
                        </div>
                      </td>
                      <td className="p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-0.5 text-primary">{docs.health.status}</div>
                          <div className="py-0.5 text-destructive leading-none text-[7px]">{docs.health.action}</div>
                          <div className="py-0.5 text-destructive">{docs.health.date}</div>
                        </div>
                      </td>
                      <td className="p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-0.5 text-primary">{docs.fumigation.status}</div>
                          <div className="py-0.5 text-destructive leading-none text-[7px]">{docs.fumigation.action}</div>
                          <div className="py-0.5 text-destructive">{docs.fumigation.date}</div>
                        </div>
                      </td>
                      <td className="p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-0.5 text-primary">{docs.quality.status}</div>
                          <div className="py-0.5 text-destructive leading-none text-[7px]">{docs.quality.action}</div>
                          <div className="py-0.5 text-destructive">{docs.quality.date}</div>
                        </div>
                      </td>
                      <td className="p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-0.5 text-primary">{docs.invoice.status}</div>
                          <div className="py-0.5 text-destructive leading-none text-[7px]">{docs.invoice.action}</div>
                          <div className="py-0.5 text-destructive">{docs.invoice.date}</div>
                        </div>
                      </td>
                      <td className="p-0 text-center">
                        <div className="grid grid-rows-3 h-full divide-y divide-primary/5 divide-dotted">
                          <div className="py-0.5 text-primary">{docs.packing.status}</div>
                          <div className="py-0.5 text-destructive leading-none text-[7px]">{docs.packing.action}</div>
                          <div className="py-0.5 text-destructive">{docs.packing.date}</div>
                        </div>
                      </td>

                      <td className="px-2 py-1 text-center text-[8px] text-muted-foreground uppercase">
                        {processo.processo_interno || '---'}
                      </td>
                    </tr>
                  );
                })}
                {!isLoading && filteredProcessos.length === 0 && (
                  <tr>
                    <td colSpan={24} className="px-4 py-12 text-center text-muted-foreground bg-background">Nenhum processo encontrado na base de dados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Link href="/dashboard/processos/novo" passHref>
        <Button className="fixed bottom-8 right-8 rounded-full shadow-2xl h-14 w-14 p-0 md:h-auto md:w-auto md:px-6 md:py-4 z-50 transition-transform hover:scale-105 active:scale-95">
          <PlusCircle className="h-6 w-6 md:mr-2" />
          <span className="hidden md:inline font-bold">Novo Processo</span>
        </Button>
      </Link>
    </div>
  );
}
