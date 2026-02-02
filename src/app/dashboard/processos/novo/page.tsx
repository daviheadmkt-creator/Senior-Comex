
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, Upload, XCircle, PlusCircle, Trash2, FileDown, Loader2, FileUp, Building, Download, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser, setDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Combobox } from '@/components/ui/combobox';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';


const processStatusOptions = [
    "Iniciado / Aguardando Booking",
    "Booking Confirmado / Aguardando Draft",
    "DRAFTS_EM_APROVAÇÃO",
    "DRAFTS_APROVADOS",
    "CORRECAO_DE_DRAFT_SOLICITADA",
    "CARGA_EM_TRANSITO_PARA_ESTUFAGEM",
    "AGUARDANDO_EMISSAO_NF_EXPORTACAO",
    "DUE_DESEMBARACADA",
    "DOSSIÊ_SUBMETIDO / AGUARDANDO_ANÁLISE_FISCAL",
    "INSPECAO_MAPA_AGENDADA",
    "INSPECAO_MAPA_REALIZADA / AGUARDANDO_RELACRE",
    "PRONTO_PARA_EMBARQUE",
    "Em trânsito",
    "DOCUMENTOS_ORIGINAIS_COLETADOS / AGUARDANDO_ENVIO",
    "Concluído",
    "Cancelado",
]

const dueStatusOptions = [
    "RASCUNHO SALVO",
    "REGISTRADA",
    "AGUARDANDO ENTREGA DO CARGA/PARAMETRIZAÇÃO",
    "DESEMABRAÇADA",
    "SELECIONADA/CANAL LARANJA (AGUARDANDO CONFERENCIA DOCUMENTAL)",
    "SELECIONADA/CANAL VERMELHO (AGUARDANDO CONFERENCIA FISICA)",
    "DESEMBARAÇADA", // This seems to be a duplicate, keeping it as requested.
    "RETIFICAÇÃO (PENDENTE DE AUTORIZAÇÃO FISCAL)",
    "AVERBADA"
];

const lpcoStatusOptions = [
    "RASCUNHO SALVO",
    "REGISTRADA/EM ANALISE",
    "REGISTRADA/EM EXIGENCIA",
    "REGISTRADA/AGUARDANDO INSPEÇÃO FISICA",
    "EM EXIGENCIA/NFA",
    "EM RETIFICAÇÃO",
    "INDEFERIDA",
    "DEFERIDA",
    "DEFERIDA/CERTIFICADO EMITIDO"
];


const documentTypes = [
    "INVOICE",
    "PACKING LIST",
    "BL",
    "FITO",
    "ORIGEM",
    "WEIGHT",
    "QUALITY",
    "HEALTH",
    "NON GMO",
    "ANALISE",
    "FUMIGATION",
    "SET DOC ENVIADO",
    "DOC SENT (ALL PDF)"
];


const initialFormData = {
    id: '',
    processo_interno: '',
    data_nomeacao: null as string | null,
    po_number: '',
    produtoNome: '',
    quantidade: '',
    exportadorId: '',
    portoEmbarqueId: '',
    portoDescargaId: '',
    terminalDespachoId: '',
    terminalEmbarqueId: '',
    exportadorNome: '',
    portoEmbarqueNome: '',
    portoDescargaNome: '',
    terminalDespachoNome: '',
    terminalEmbarqueNome: '',
    destino: '',
    status: 'Iniciado / Aguardando Booking',
    booking_number: '',
    armadorId: '',
    navio: '',
    viagem: '',
    containers: [] as any[],
    documentos_pos_embarque: [] as { id: number; nome: string; originais: number; copias: number; data_emissao: string | null; data_liberacao: string | null; file: any }[],
    notas_fiscais: [] as any[],
    due_numero: '',
    due_status: 'RASCUNHO SALVO',
    due_file: null as { name: string; url: string } | null,
    lpco_protocolo: '',
    mapa_status: 'RASCUNHO SALVO',
    lpco_file: null as { name: string; url: string } | null,
    navio_final: '',
    awb_courier: '',
    analistaId: '',
    analistaNome: '',
    draft_bl_file: null as { name: string; url: string } | null,
    draft_fito_file: null as { name: string; url: string } | null,
    draft_co_file: null as { name: string; url: string } | null,
    deadline_draft: null as string | null,
    deadline_vgm: null as string | null,
    deadline_carga: null as string | null,
    etd: null as string | null,
    eta: null as string | null,
    deadline_draft_file: null as { name: string; url: string } | null,
    deadline_vgm_file: null as { name: string; url: string } | null,
    deadline_carga_file: null as { name: string; url: string } | null,
  };

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return 'outline';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('trânsito') || lowerStatus.includes('confirmado') || lowerStatus.includes('aprovados') || lowerStatus.includes('desembaraçada') || lowerStatus.includes('deferido') || lowerStatus.includes('realizada') || lowerStatus.includes('concluído')) return 'default';
    if (lowerStatus.includes('pronto')) return 'outline';
    if (lowerStatus.includes('aguardando') || lowerStatus.includes('iniciado') || lowerStatus.includes('em aprovação') || lowerStatus.includes('submetido')) return 'secondary';
    if (lowerStatus.includes('atrasado') || lowerStatus.includes('cancelado') || lowerStatus.includes('correcao') || lowerStatus.includes('rejeitado')) return 'destructive';
    return 'outline';
};

export default function NovoProcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerFileInputRef = useRef<HTMLInputElement>(null);
  const nfFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string | { type: 'nota_fiscal', index: number } | { type: 'documento_pos_embarque', index: number } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  
  const isEditing = searchParams.has('edit');
  const processId = searchParams.get('id');

  const processoDocRef = useMemoFirebase(() => {
    if (!firestore || !processId) return null;
    return doc(firestore, 'processos', processId);
  }, [firestore, processId]);
  
  const { data: processoData, isLoading: isLoadingProcesso } = useDoc(processoDocRef);

  const partnersCollection = useMemoFirebase(() => firestore ? collection(firestore, 'partners') : null, [firestore]);
  const { data: parceiros, isLoading: isLoadingParceiros } = useCollection(partnersCollection);
  
  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'partners'), where('tipo_parceiro', '==', 'Produto'));
  }, [firestore]);
  const { data: produtos, isLoading: isLoadingProdutos } = useCollection(productsQuery);
  
  const portsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'ports') : null, [firestore]);
    const { data: portos, isLoading: isLoadingPorts } = useCollection(portsCollection);

  const terminalsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'terminals') : null, [firestore]);
  const { data: terminais, isLoading: isLoadingTerminais } = useCollection(terminalsCollection);


  const [formData, setFormData] = useState<any>(initialFormData);
  const [exporterContacts, setExporterContacts] = useState<any[]>([]);
  
  const userDocRef = useMemoFirebase(
    () => (firestore && currentUser ? doc(firestore, 'users', currentUser.uid) : null),
    [firestore, currentUser]
  );
  
  const sortedPorts = useMemo(() => {
      if (!portos) return [];
      return [...portos].sort((a, b) => a.name.localeCompare(b.name));
  }, [portos]);

  const portOptions = useMemo(() => {
    if (!sortedPorts) return [];
    return sortedPorts.map(port => ({ value: port.id, label: `${port.name} - ${port.country}` }));
  }, [sortedPorts]);


  const [filteredTerminais, setFilteredTerminais] = useState<any[]>([]);

    useEffect(() => {
    if (isEditing && processoData) {
      const selectedExporter = parceiros?.find(p => p.id === processoData.exportadorId);
      const newContacts = selectedExporter?.contatos?.filter((c: any) => c.nome).map((c, index) => ({...c, id: String(index) })) || [];
      setExporterContacts(newContacts);

      setFormData({
        ...initialFormData,
        ...processoData,
        data_nomeacao: processoData.data_nomeacao || null,
        deadline_draft: processoData.deadline_draft,
        deadline_vgm: processoData.deadline_vgm,
        deadline_carga: processoData.deadline_carga,
        etd: processoData.etd,
        eta: processoData.eta,
        containers: processoData.containers || [],
        documentos_pos_embarque: processoData.documentos_pos_embarque || [],
        notas_fiscais: processoData.notas_fiscais || [],
        analistaId: String(processoData.analistaId || ''),
        analistaNome: String(processoData.analistaNome || ''),
        portoEmbarqueId: String(processoData.portoEmbarqueId || ''),
        portoDescargaId: String(processoData.portoDescargaId || ''),
        armadorId: String(processoData.armadorId || ''),
      });
      if (processoData.portoEmbarqueId && terminais) {
        const filtered = terminais.filter((t: any) => String(t.portoId) === String(processoData.portoEmbarqueId));
        setFilteredTerminais(filtered);
      }
    }
  }, [isEditing, processoData, terminais, parceiros]);

 useEffect(() => {
    if (formData.exportadorId && parceiros) {
        const selectedExporter = parceiros.find(p => p.id === formData.exportadorId);
        const newContacts = selectedExporter?.contatos?.filter((c: any) => c.nome).map((c: any, index: number) => ({...c, id: String(index) })) || [];
        setExporterContacts(newContacts);
    } else if (!formData.exportadorId) {
        setExporterContacts([]);
    }
}, [formData.exportadorId, parceiros]);

useEffect(() => {
    if (formData.analistaId && exporterContacts.length > 0) {
        const contact = exporterContacts.find(c => String(c.id) === String(formData.analistaId));
        if (contact && contact.nome !== formData.analistaNome) {
            handleInputChange('analistaNome', contact.nome);
        }
    }
}, [formData.analistaId, exporterContacts]);

  
  const isLoading = isLoadingProcesso || isLoadingParceiros || isLoadingProdutos || isLoadingPorts || isLoadingTerminais;

  const pageTitle = isEditing ? `Editar Processo ${formData.processo_interno || ''}` : 'Novo Processo (Nomeação)';
  const pageDescription = isEditing
    ? 'Gerencie todas as etapas do processo de exportação.'
    : 'Inicie um novo processo a partir de uma nomeação.';
    
    const handleInputChange = (id: string, value: any) => {
        setFormData(prev => {
            let newState = { ...prev, [id]: value ?? '' };

            if (id === 'navio') {
                newState.navio_final = value ?? '';
            }

            // Logic to automatically update status
            const currentStatus = newState.status;
            let nextStatus = currentStatus;

            const statusNumber = processStatusOptions.indexOf(currentStatus);
            
            if (currentStatus === "Iniciado / Aguardando Booking" && newState.booking_number) {
                nextStatus = "Booking Confirmado / Aguardando Draft";
            } else if (currentStatus === "Booking Confirmado / Aguardando Draft" || currentStatus === "CORRECAO_DE_DRAFT_SOLICITADA") {
                 if(newState.draft_bl_file || newState.draft_fito_file || newState.draft_co_file) {
                    nextStatus = "DRAFTS_EM_APROVAÇÃO";
                 }
            } else if (id === 'status' && value === 'DRAFTS_APROVADOS') { // Manual trigger
                nextStatus = "AGUARDANDO_EMISSAO_NF_EXPORTACAO";
            } else if (statusNumber >= processStatusOptions.indexOf("DRAFTS_APROVADOS")) {
                const isDueOk = newState.due_status === 'DESEMABRAÇADA' || newState.due_status === 'AVERBADA';
                const isMapaOk = newState.mapa_status === 'DEFERIDA' || newState.mapa_status === 'DEFERIDA/CERTIFICADO EMITIDO';
                const areNFsOk = newState.notas_fiscais.length > 0 && newState.notas_fiscais.every((nf:any) => nf.chave);
                const areContainersOk = newState.containers.length > 0 && newState.containers.every((c:any) => c.numero && c.lacre && (!c.inspecionado || (c.inspecionado && c.novo_lacre)));

                if(isDueOk && isMapaOk && areNFsOk && areContainersOk) {
                    nextStatus = "PRONTO_PARA_EMBARQUE";
                }
            }
            
            if (newState.navio_final) {
                 const hasBL = newState.documentos_pos_embarque?.some((d: any) => d.nome === 'BL' && d.file);
                 if (hasBL) {
                    nextStatus = "Em trânsito";
                 }
            }
            
            if (statusNumber >= processStatusOptions.indexOf("Em trânsito")) {
                 if (newState.documentos_pos_embarque?.length > 0 && newState.documentos_pos_embarque.every((doc: any) => doc.file)) {
                    nextStatus = "DOCUMENTOS_ORIGINAIS_COLETADOS / AGUARDANDO_ENVIO";
                 }
            }
            
            if (currentStatus.startsWith("DOCUMENTOS_ORIGINAIS_COLETADOS") && newState.awb_courier) {
                nextStatus = "Concluído";
            }

            if (nextStatus !== currentStatus) {
                return { ...newState, status: nextStatus };
            }

            return newState;
        });
    };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, '');
    if (!digitsOnly) {
        handleInputChange('quantidade', '');
        return;
    }
    const number = parseInt(digitsOnly, 10);
    const formatted = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5
    }).format(number / 100000);

    handleInputChange('quantidade', `${formatted} TON`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const fileData = {
            name: file.name,
            url: dataUrl,
            type: file.type,
        };

        if (typeof uploadTarget === 'string') {
            handleInputChange(uploadTarget, fileData);
        } else if (typeof uploadTarget === 'object') {
            if (uploadTarget.type === 'nota_fiscal') {
                const { index } = uploadTarget;
                handleNotaFiscalChange(index, 'file', fileData);

                if (file.name.toLowerCase().endsWith('.xml')) {
                    try {
                        const base64Content = dataUrl.split(',')[1];
                        const xmlText = atob(base64Content);
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                        const infNFe = xmlDoc.getElementsByTagName('infNFe')[0];
                        if (infNFe) {
                            const idAttr = infNFe.getAttribute('Id');
                            if (idAttr && idAttr.startsWith('NFe')) {
                                const chave = idAttr.substring(3);
                                if (chave.length === 44) {
                                    handleNotaFiscalChange(index, 'chave', chave);
                                    toast({
                                        title: "Chave da NF-e Extraída!",
                                        description: "A chave de acesso foi lida do XML e preenchida automaticamente.",
                                    });
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Error parsing XML from data URL:", error);
                        toast({
                            title: 'Erro ao ler XML',
                            description: 'Não foi possível extrair a chave do ficheiro XML.',
                            variant: 'destructive',
                        });
                    }
                }
            } else if (uploadTarget.type === 'documento_pos_embarque') {
                const { index } = uploadTarget;
                handlePostShipmentDocChange(index, 'file', fileData);
            }
        }

        toast({
            title: "Ficheiro Anexado",
            description: `${file.name} foi anexado com sucesso.`,
        });

        if (fileInputRef.current) fileInputRef.current.value = '';
        setUploadTarget(null);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = (target: string | object) => {
    setUploadTarget(target as any);
    fileInputRef.current?.click();
  };

  const removeFile = (target: string | {type: 'nota_fiscal', index: number} | {type: 'documento_pos_embarque', index: number}) => {
    if (typeof target === 'string') {
      handleInputChange(target, null);
    } else if (typeof target === 'object') {
        if (target.type === 'nota_fiscal') {
            handleNotaFiscalChange(target.index, 'file', null);
        } else if (target.type === 'documento_pos_embarque') {
            handlePostShipmentDocChange(target.index, 'file', null);
        }
    }
    toast({
      title: "Anexo Removido",
      description: "O ficheiro foi removido.",
      variant: "destructive"
    });
  };
  
  const handlePortChange = (value: string) => {
    handleInputChange('portoEmbarqueId', value);
    if (terminais) {
        const filtered = terminais.filter(t => String(t.portoId) === value);
        setFilteredTerminais(filtered);
    }
  }
  
  const handleContainerChange = (index: number, field: string, value: string | boolean) => {
    const updatedContainers = [...formData.containers];
    (updatedContainers[index] as any)[field] = value;
    setFormData(prev => ({...prev, containers: updatedContainers}));
  };

  const handlePostShipmentDocChange = (index: number, field: string, value: any) => {
    const updatedDocuments = [...formData.documentos_pos_embarque];
    (updatedDocuments[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, documentos_pos_embarque: updatedDocuments }));
  };

  const addPostShipmentDoc = () => {
    setFormData(prev => ({
        ...prev,
        documentos_pos_embarque: [...prev.documentos_pos_embarque, { id: Date.now(), nome: '', originais: 1, copias: 1, data_emissao: null, data_liberacao: null, file: null }]
    }));
  };

  const removePostShipmentDoc = (index: number) => {
    const updatedDocuments = formData.documentos_pos_embarque.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, documentos_pos_embarque: updatedDocuments }));
  };
  
  const handleNotaFiscalChange = (index: number, field: string, value: any) => {
    const updatedNotas = [...formData.notas_fiscais];
    (updatedNotas[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, notas_fiscais: updatedNotas }));
  };

  const handleMultipleNFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      for (const file of Array.from(files)) {
          const reader = new FileReader();
          reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              
              let chave = '';
              if (file.name.toLowerCase().endsWith('.xml')) {
                  try {
                      const base64Content = dataUrl.split(',')[1];
                      const xmlText = atob(base64Content);
                      const parser = new DOMParser();
                      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                      const infNFe = xmlDoc.getElementsByTagName('infNFe')[0];
                      if (infNFe) {
                          const idAttr = infNFe.getAttribute('Id');
                          if (idAttr && idAttr.startsWith('NFe')) {
                              const extractedChave = idAttr.substring(3);
                              if (extractedChave.length === 44) {
                                  chave = extractedChave;
                              }
                          }
                      }
                  } catch (error) {
                      console.error("Error parsing XML from data URL:", error);
                  }
              }

              const newNota = {
                  id: Date.now() + Math.random(),
                  tipo: 'Remessa',
                  chave: chave,
                  data_pedido: null,
                  data_recebida: null,
                  file: {
                      name: file.name,
                      url: dataUrl,
                      type: file.type
                  }
              };
              
              setFormData(prev => ({
                  ...prev,
                  notas_fiscais: [...prev.notas_fiscais, newNota]
              }));
          };
          reader.readAsDataURL(file);
      }

      toast({
          title: "Ficheiros Carregados",
          description: `${files.length} nota(s) fiscal(is) foram adicionadas para processamento.`
      });

      if (nfFileInputRef.current) nfFileInputRef.current.value = '';
  };


  const removeNotaFiscal = (index: number) => {
    const updatedNotas = formData.notas_fiscais.filter((_: any, i: number) => i !== index);
    setFormData(prev => ({ ...prev, notas_fiscais: updatedNotas }));
  };

  const addContainer = () => {
    setFormData(prev => ({
        ...prev,
        containers: [...prev.containers, { 
            id: Date.now(), 
            numero: '', 
            lacre: '', 
            tare: '',
            qty_especie: '',
            gross_weight: '',
            net_weight: '',
            m3: '',
            vgm: '', 
            inspecionado: false, 
            novo_lacre: '' 
        }]
    }));
  };

  const removeContainer = (index: number) => {
    const updatedContainers = formData.containers.filter((_, i) => i !== index);
    setFormData(prev => ({...prev, containers: updatedContainers}));
  };

 const getStepStatusIcon = (step: number) => {
    const { status, booking_number, due_status, mapa_status, documentos_pos_embarque, awb_courier,
            notas_fiscais, containers, navio_final } = formData;
    
    const statusNumber = processStatusOptions.indexOf(status);

    switch (step) {
        case 1: // Processo e Booking
            if (booking_number) return <CheckCircle className="h-5 w-5 text-green-500" />;
            return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
        case 2: // Drafts
            const draftsApprovedOrLater = statusNumber >= processStatusOptions.indexOf("DRAFTS_APROVADOS");
            if (draftsApprovedOrLater) return <CheckCircle className="h-5 w-5 text-green-500" />;
            if (status === 'CORRECAO_DE_DRAFT_SOLICITADA') return <XCircle className="h-5 w-5 text-red-500" />;
            if (booking_number) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
            return <XCircle className="h-5 w-5 text-gray-400" />;
        case 3: // Liberação
            const isDueOk = due_status === 'DESEMABRAÇADA' || due_status === 'AVERBADA';
            const isMapaOk = mapa_status === 'DEFERIDA' || mapa_status === 'DEFERIDA/CERTIFICADO EMITIDO';
            const areNFsOk = notas_fiscais.length > 0 && notas_fiscais.every((nf:any) => nf.chave);
            const areContainersOk = containers.length > 0 && containers.every((c:any) => c.numero && c.lacre && (!c.inspecionado || (c.inspecionado && c.novo_lacre)));
            if (isDueOk && isMapaOk && areNFsOk && areContainersOk) {
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            }
            if (mapa_status === 'INDEFERIDA') return <XCircle className="h-5 w-5 text-red-500" />;
            if (statusNumber >= processStatusOptions.indexOf("DRAFTS_APROVADOS")) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
            return <XCircle className="h-5 w-5 text-gray-400" />;
        case 4: // Confirmação de Embarque
            if (formData.navio_final) {
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            }
            const isReadyForShipment = statusNumber >= processStatusOptions.indexOf("PRONTO_PARA_EMBARQUE");
            if(isReadyForShipment) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
            return <XCircle className="h-5 w-5 text-gray-400" />;
        case 5: // Docs Pós-Embarque
            const hasBlWithFile = documentos_pos_embarque && documentos_pos_embarque.some((d: any) => d.nome === 'BL' && d.file);
            if (hasBlWithFile && statusNumber >= processStatusOptions.indexOf("Em trânsito")) {
                 if (documentos_pos_embarque.every((d:any) => d.file)) return <CheckCircle className="h-5 w-5 text-green-500" />;
                 return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
            }
            if (statusNumber >= processStatusOptions.indexOf("Em trânsito")) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
            return <XCircle className="h-5 w-5 text-gray-400" />;
        case 6: // Encerramento
            if (status === "Concluído") return <CheckCircle className="h-5 w-5 text-green-500" />;
            if (awb_courier) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
            return <XCircle className="h-5 w-5 text-gray-400" />;
        default:
            return null;
    }
};

const handleCreateContact = (contactName: string) => {
    if (!firestore || !formData.exportadorId || !parceiros) return;
    
    const selectedExporter = parceiros.find(p => p.id === formData.exportadorId);
    if (!selectedExporter) return;
    
    const newContact = { nome: contactName, email: '', telefone: '', cargo: '' };
    const updatedContacts = [...(selectedExporter.contatos || []), newContact];
    
    const partnerRef = doc(firestore, 'partners', formData.exportadorId);
    setDocumentNonBlocking(partnerRef, { contatos: updatedContacts }, { merge: true });
    
    const newContactId = String(updatedContacts.length - 1);
    const newContactsForState = updatedContacts.map((c, i) => ({ ...c, id: String(i) }));
    setExporterContacts(newContactsForState);

    setFormData(prev => ({
        ...prev,
        analistaId: newContactId,
        analistaNome: contactName
    }));
    
    toast({
        title: "Contato Criado",
        description: `"${contactName}" foi adicionado a ${selectedExporter.nome_fantasia}.`
    });
};

const handleCreatePartner = (partnerName: string) => {
    if (!firestore) return;
    
    const newPartnerId = doc(collection(firestore, 'partners')).id;
    const newPartnerData = {
        id: newPartnerId,
        nome_fantasia: partnerName,
        tipo_parceiro: "Armador"
    };

    const partnerRef = doc(firestore, 'partners', newPartnerId);
    setDocumentNonBlocking(partnerRef, newPartnerData, { merge: true });

    setFormData(prev => ({
        ...prev,
        armadorId: newPartnerId,
    }));
    
    toast({
        title: "Armador Criado",
        description: `"${partnerName}" foi adicionado à base de dados de parceiros.`
    });
};

const handleCreateTerminal = (terminalName: string, tipo: 'Terminal de Estufagem' | 'Terminal de Embarque') => {
    if (!firestore) return;
    
    const newPartnerId = doc(collection(firestore, 'partners')).id;
    const newPartnerData = {
        id: newPartnerId,
        nome_fantasia: terminalName,
        tipo_parceiro: tipo
    };

    const partnerRef = doc(firestore, 'partners', newPartnerId);
    setDocumentNonBlocking(partnerRef, newPartnerData, { merge: true });

    const fieldId = tipo === 'Terminal de Estufagem' ? 'terminalDespachoId' : 'terminalEmbarqueId';
    setFormData(prev => ({
        ...prev,
        [fieldId]: newPartnerId,
    }));
    
    toast({
        title: "Terminal Criado",
        description: `"${terminalName}" foi adicionado à base de dados de parceiros como ${tipo}.`
    });
};


    const generateOriginalDocsPdf = async () => {
        const doc = new jsPDF();
        
        let originalsCount = formData.documentos_pos_embarque.reduce((acc: number, doc: any) => acc + (Number(doc.originais) || 0), 0);
        let copiesCount = formData.documentos_pos_embarque.reduce((acc: number, doc: any) => acc + (Number(doc.copias) || 0), 0);

        // Cover Page
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('PACOTE DE DOCUMENTOS DE EMBARQUE', 105, 40, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text(`Processo: ${formData.processo_interno || 'N/A'}`, 105, 60, { align: 'center' });

        if (formData.awb_courier) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'normal');
            doc.text(`AWB do Courier: ${formData.awb_courier}`, 105, 70, { align: 'center' });
        }

        (doc as any).autoTable({
            startY: 90,
            head: [['Resumo do Pacote']],
            body: [
                [`Total de Documentos Originais: ${originalsCount}`],
                [`Total de Documentos em Cópia: ${copiesCount}`],
            ],
            theme: 'plain',
            headStyles: { fontStyle: 'bold', fontSize: 14, halign: 'center' },
            bodyStyles: { fontSize: 12, halign: 'center' },
        });

        (doc as any).autoTable({
            startY: (doc as any).lastAutoTable.finalY + 10,
            head: [['Documento', 'Qtd. Originais', 'Qtd. Cópias', 'Data Emissão', 'Data Liberação', 'Ficheiro Anexado']],
            body: formData.documentos_pos_embarque
                .map((doc: any) => [
                    doc.nome,
                    doc.originais || '0',
                    doc.copias || '0',
                    doc.data_emissao ? new Date(doc.data_emissao).toLocaleDateString('pt-BR') : 'N/A',
                    doc.data_liberacao ? new Date(doc.data_liberacao).toLocaleDateString('pt-BR') : 'N/A',
                    doc.file ? doc.file.name : 'Nenhum'
                ]),
            theme: 'striped',
            headStyles: { fillColor: [34, 107, 72] }, // Dark green
        });

        // Loop through attached files and add them to the PDF
        for (const docItem of formData.documentos_pos_embarque) {
            if (docItem.file && docItem.file.url) {
                doc.addPage();
                doc.setFontSize(12);
                doc.text(`Anexo: ${docItem.nome} (${docItem.file.name})`, 14, 20);

                try {
                    if (docItem.file.type && docItem.file.type.startsWith('image/')) {
                        const format = docItem.file.type.split('/')[1]?.toUpperCase() || 'JPEG';
                        doc.addImage(docItem.file.url, format, 15, 40, 180, 160, undefined, 'FAST');
                    } else if (docItem.file.type === 'application/pdf') {
                        doc.rect(14, 40, 182, 217);
                        doc.setFontSize(16);
                        doc.setTextColor(150);
                        doc.text('Documento PDF Anexado', 105, 140, { align: 'center' });
                        doc.setFontSize(12);
                        doc.text(`Ficheiro: ${docItem.file.name}`, 105, 150, { align: 'center' });
                        doc.text('A funcionalidade de fundir PDFs existentes não é suportada.', 105, 160, {align: 'center'});
                    } else {
                        doc.text(`Não foi possível pré-visualizar o ficheiro: ${docItem.file.name}`, 14, 40);
                    }
                } catch (e) {
                     console.error("Error adding file to PDF:", e);
                     doc.text(`Não foi possível pré-visualizar o ficheiro: ${docItem.file.name}`, 14, 40);
                }
            }
        }


        doc.save(`Malote_Documentos_${formData.processo_interno || 'processo'}.pdf`);
    };

    const generateNFsPdf = async () => {
        const doc = new jsPDF();
        
        // Cover Page
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('PACOTE DE NOTAS FISCAIS', 105, 40, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text(`Processo: ${formData.processo_interno || 'N/A'}`, 105, 60, { align: 'center' });
        
        (doc as any).autoTable({
            startY: 80,
            head: [['Tipo', 'Chave de Acesso', 'Ficheiro', 'Data Pedido', 'Data Recebida']],
            body: formData.notas_fiscais.map((nf: any) => [
                nf.tipo,
                nf.chave || 'N/A',
                nf.file ? nf.file.name : 'Nenhum',
                nf.data_pedido ? new Date(nf.data_pedido).toLocaleDateString('pt-BR') : 'N/A',
                nf.data_recebida ? new Date(nf.data_recebida).toLocaleDateString('pt-BR') : 'N/A',
            ]),
            theme: 'striped',
            headStyles: { fillColor: [34, 107, 72] },
        });

        // Loop through attached files and add them to the PDF
        for (const nf of formData.notas_fiscais) {
            if (nf.file && nf.file.url) {
                doc.addPage();
                doc.setFontSize(12);
                doc.text(`Anexo: ${nf.tipo} - ${nf.file.name}`, 14, 20);

                try {
                    if (nf.file.type && nf.file.type.startsWith('image/')) {
                         const format = nf.file.type.split('/')[1]?.toUpperCase() || 'JPEG';
                         doc.addImage(nf.file.url, format, 15, 40, 180, 160, undefined, 'FAST');
                    } else if (nf.file.type === 'application/pdf') {
                         doc.rect(14, 40, 182, 217);
                        doc.setFontSize(16);
                        doc.setTextColor(150);
                        doc.text('Documento PDF Anexado', 105, 140, { align: 'center' });
                        doc.setFontSize(12);
                        doc.text(`Ficheiro: ${nf.file.name}`, 105, 150, { align: 'center' });
                        doc.text('A funcionalidade de fundir PDFs existentes não é suportada.', 105, 160, {align: 'center'});
                    } else {
                        doc.text(`Não foi possível pré-visualizar o ficheiro: ${nf.file.name}`, 14, 40);
                    }
                } catch (e) {
                     console.error("Error adding NF file to PDF:", e);
                     doc.text(`Não foi possível pré-visualizar o ficheiro: ${nf.file.name}`, 14, 40);
                }
            }
        }

        doc.save(`Pacote_NFs_${formData.processo_interno || 'processo'}.pdf`);
    };


    const handleContainerImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);

                const newContainers = json.map(row => ({
                    id: Date.now() + Math.random(),
                    numero: String(row.numero || ''),
                    lacre: String(row.lacre || ''),
                    tare: String(row.tare || ''),
                    qty_especie: String(row.qty_especie || ''),
                    gross_weight: String(row.gross_weight || ''),
                    net_weight: String(row.net_weight || ''),
                    m3: String(row.m3 || ''),
                    vgm: String(row.vgm || ''),
                    inspecionado: false,
                    novo_lacre: ''
                }));

                setFormData(prev => ({...prev, containers: [...prev.containers, ...newContainers]}));
                
                toast({
                    title: 'Importação Concluída',
                    description: `${newContainers.length} contêineres foram importados com sucesso.`,
                });
            } catch (error) {
                console.error("Erro ao importar planilha:", error);
                toast({
                    title: 'Erro na Importação',
                    description: 'Houve um problema ao ler o ficheiro. Verifique o formato e tente novamente.',
                    variant: 'destructive',
                });
            } finally {
                setIsImporting(false);
                if (containerFileInputRef.current) {
                    containerFileInputRef.current.value = '';
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleImportClick = () => {
        containerFileInputRef.current?.click();
    };

    const handleDownloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            { numero: "MSCU1234567", lacre: "SEAL123", tare: "2200", qty_especie: "540", gross_weight: "27000", net_weight: "24800", m3: "33", vgm: "27000" },
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Containers");
        XLSX.writeFile(wb, "template_containers.xlsx");
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    const docId = processId || doc(collection(firestore, 'processos')).id;
    const processoRef = doc(firestore, 'processos', docId);

    const selectedExporter = parceiros?.find(p => String(p.id) === String(formData.exportadorId));
    const selectedAnalista = exporterContacts.find(c => String(c.id) === String(formData.analistaId));
    const selectedPortoEmbarque = portos?.find(p => String(p.id) === String(formData.portoEmbarqueId));
    const selectedPortoDescarga = portos?.find(p => String(p.id) === String(formData.portoDescargaId));
    
    const dataToSave = {
        ...formData,
        id: docId,
        exportadorNome: selectedExporter?.nome_fantasia || formData.exportadorNome || 'N/A',
        analistaNome: selectedAnalista?.nome || formData.analistaNome || 'N/A',
        portoEmbarqueNome: selectedPortoEmbarque?.name || formData.portoEmbarqueNome || 'N/A',
        portoDescargaNome: selectedPortoDescarga?.name || formData.portoDescargaNome || 'N/A',
        destino: selectedPortoDescarga?.name || formData.destino || 'N/A',
    };
    
    setDocumentNonBlocking(processoRef, dataToSave, { merge: true });

    toast({
        title: "Sucesso!",
        description: `Processo ${isEditing ? 'atualizado' : 'criado'}.`,
        variant: "default",
    });

    router.push('/dashboard/processos');
  };
  
  if (isLoading) {
      return (
          <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-start">
            <div className='flex items-center gap-4'>
            <Link href="/dashboard/processos" passHref>
                <Button variant="outline" size="icon" type="button">
                <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
                <p className="text-muted-foreground">{pageDescription}</p>
                {isEditing && (
                    <div className='mt-2'>
                        <Badge variant={getStatusVariant(formData.status)}>{formData.status}</Badge>
                    </div>
                )}
            </div>
            </div>
             <div className="flex justify-end gap-2">
                <Link href="/dashboard/processos" passHref>
                    <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit">Salvar Alterações</Button>
            </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xml,.pdf,image/*" />
        <input
            type="file"
            ref={containerFileInputRef}
            onChange={handleContainerImport}
            className="hidden"
            accept=".xlsx, .xls"
        />
        <input
            type="file"
            ref={nfFileInputRef}
            onChange={handleMultipleNFUpload}
            className="hidden"
            accept=".xml,.pdf"
            multiple
        />

        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          {/* Etapa 1 */}
          <AccordionItem value="item-1">
            <AccordionTrigger>
                <div className='flex items-center gap-3'>
                    {getStepStatusIcon(1)}
                    <div className='text-left'>
                        <h3 className="text-lg font-semibold">Etapa 1: Dados do Processo e Booking</h3>
                        <p className='text-sm text-muted-foreground'>Dados da nomeação e da reserva de praça confirmada pelo armador.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="grid gap-6 pt-6">
                        <div className="grid md:grid-cols-3 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="processo_interno">Número do Processo Interno</Label>
                                <Input id="processo_interno" value={formData.processo_interno || ''} onChange={e => handleInputChange('processo_interno', e.target.value)} placeholder="Ex: SEN-2024-001" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="po_number">Nº do Contrato/PO</Label>
                                <Input id="po_number" value={formData.po_number || ''} onChange={e => handleInputChange('po_number', e.target.value)} placeholder="Ex: 3426B" />
                            </div>
                             <div className="space-y-2">
                                <Label>Data da Nomeação</Label>
                                <DatePicker 
                                    date={formData.data_nomeacao}
                                    onDateChange={(date) => handleInputChange('data_nomeacao', date)} 
                                />
                            </div>
                        </div>

                         <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="exportadorId">Unidade Carregadora (Exportador)</Label>
                                <Combobox 
                                     items={parceiros?.filter(p => p.tipo_parceiro === 'Exportador').sort((a, b) => a.nome_fantasia.localeCompare(b.nome_fantasia)).map(p => ({ value: p.id, label: `${p.nome_fantasia || ''} | ${p.cnpj || 'N/A'}` })) || []}
                                     value={formData.exportadorId}
                                     onValueChange={(value) => {
                                        handleInputChange('exportadorId', value)
                                        handleInputChange('analistaId', '')
                                     }}
                                     placeholder={isLoadingParceiros ? "Carregando..." : "Selecione o parceiro"}
                                     searchPlaceholder="Buscar parceiro..."
                                     noResultsText="Nenhum parceiro encontrado."
                                 />
                            </div>
                           <div className="space-y-2">
                                <Label htmlFor="analistaId">Contato do Exportador</Label>
                                 <Combobox
                                    items={exporterContacts.map(c => ({ value: String(c.id), label: `${c.nome} (${c.cargo || 'N/A'})` }))}
                                    value={String(formData.analistaId || '')}
                                    onValueChange={(id) => {
                                      const contact = exporterContacts.find(c => String(c.id) === id);
                                      if (contact) {
                                        handleInputChange('analistaId', contact.id);
                                        handleInputChange('analistaNome', contact.nome);
                                      } else {
                                        handleInputChange('analistaId', '');
                                        handleInputChange('analistaNome', '');
                                      }
                                    }}
                                    placeholder={!formData.exportadorId ? "Selecione um exportador" : "Selecione o contato"}
                                    searchPlaceholder="Buscar ou criar contato..."
                                    noResultsText="Nenhum contato encontrado."
                                    disabled={!formData.exportadorId}
                                    creatable
                                    onCreate={handleCreateContact}
                                 />
                            </div>
                         </div>

                        <div className="grid md:grid-cols-2 gap-4">
                           
                            <div className="space-y-2">
                               <Label htmlFor="produtoNome">Produto</Label>
                               <Input 
                                    id="produtoNome"
                                    placeholder='Nome do produto'
                                    value={formData.produtoNome || ''}
                                    onChange={(e) => handleInputChange('produtoNome', e.target.value)}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="quantidade">Quantidade</Label>
                                <Input id="quantidade" value={formData.quantidade || ''} onChange={handleQuantityChange} placeholder="Ex: 270,00000 TON" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="booking_number">Nº do Booking</Label>
                                <Input id="booking_number" value={formData.booking_number || ''} onChange={e => handleInputChange('booking_number', e.target.value)} placeholder="Insira o número do booking" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="armadorId">Armador</Label>
                                <Combobox 
                                    items={parceiros?.filter(p => p.tipo_parceiro === 'Armador').map(p => ({ value: p.id, label: p.nome_fantasia })) || []}
                                    value={formData.armadorId}
                                    onValueChange={(value) => handleInputChange('armadorId', value)}
                                    placeholder={isLoadingParceiros ? "Carregando..." : "Selecionar os armadores.."}
                                    searchPlaceholder="Buscar ou criar armador..."
                                    noResultsText="Nenhum armador encontrado."
                                    creatable
                                    onCreate={handleCreatePartner}
                                />
                            </div>
                        </div>

                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="portoEmbarqueId">Porto de Embarque</Label>
                                 <Combobox 
                                     items={portOptions}
                                     value={formData.portoEmbarqueId}
                                     onValueChange={(value) => handlePortChange(value)}
                                     placeholder={isLoadingPorts ? "Carregando..." : "Selecione o porto"}
                                     searchPlaceholder="Buscar porto..."
                                     noResultsText="Nenhum porto encontrado."
                                 />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="portoDescargaId">Porto de Descarga</Label>
                                <Combobox 
                                     items={portOptions}
                                     value={formData.portoDescargaId}
                                     onValueChange={(value) => handleInputChange('portoDescargaId', value)}
                                     placeholder={isLoadingPorts ? "Carregando..." : "Selecione o porto"}
                                     searchPlaceholder="Buscar porto..."
                                     noResultsText="Nenhum porto encontrado."
                                 />
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="navio">Navio / Viagem</Label>
                                <Input id="navio" value={formData.navio || ''} onChange={e => handleInputChange('navio', e.target.value)} placeholder="Ex: MSC EUGENIA / NAS21R" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="viagem">Armazém</Label>
                                <Input id="viagem" value={formData.viagem || ''} onChange={e => handleInputChange('viagem', e.target.value)} placeholder="Ex: TCP" />
                            </div>
                        </div>
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="terminalDespachoId">Terminal de Estufagem</Label>
                                 <Combobox 
                                     items={parceiros?.filter(p => p.tipo_parceiro === 'Terminal de Estufagem').map(p => ({ value: p.id, label: p.nome_fantasia })) || []}
                                     value={formData.terminalDespachoId}
                                     onValueChange={(value) => handleInputChange('terminalDespachoId', value)}
                                     placeholder={isLoadingParceiros ? "Carregando..." : "Selecione ou crie um terminal"}
                                     searchPlaceholder="Buscar ou criar terminal..."
                                     noResultsText="Nenhum terminal encontrado."
                                     creatable
                                     onCreate={(name) => handleCreateTerminal(name, 'Terminal de Estufagem')}
                                 />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="terminalEmbarqueId">Terminal de Embarque</Label>
                                 <Combobox 
                                     items={parceiros?.filter(p => p.tipo_parceiro === 'Terminal de Embarque').map(p => ({ value: p.id, label: p.nome_fantasia })) || []}
                                     value={formData.terminalEmbarqueId}
                                     onValueChange={(value) => handleInputChange('terminalEmbarqueId', value)}
                                     placeholder={isLoadingParceiros ? "Carregando..." : "Selecione ou crie um terminal"}
                                     searchPlaceholder="Buscar ou criar terminal..."
                                     noResultsText="Nenhum terminal encontrado."
                                     creatable
                                     onCreate={(name) => handleCreateTerminal(name, 'Terminal de Embarque')}
                                 />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Previsão de Embarque (ETD)</Label>
                                <DatePicker date={formData.etd} onDateChange={date => handleInputChange('etd', date)} showTime />
                            </div>
                            <div className="space-y-2">
                                <Label>Previsão de Chegada (ETA)</Label>
                                <DatePicker date={formData.eta} onDateChange={date => handleInputChange('eta', date)} showTime />
                            </div>
                        </div>
                         <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label>Deadline Draft</Label>
                                <div className="flex items-center gap-2">
                                <DatePicker date={formData.deadline_draft} onDateChange={date => handleInputChange('deadline_draft', date)} showTime />
                                {formData.deadline_draft_file ? (
                                    <div className="flex items-center gap-1">
                                         <a href={formData.deadline_draft_file.url} download={formData.deadline_draft_file.name} title={`Descarregar ${formData.deadline_draft_file.name}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                            <Download className="h-4 w-4 text-green-600" />
                                        </a>
                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeFile('deadline_draft_file')} className="text-destructive hover:text-destructive" title="Remover anexo">
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="icon" type="button" title="Anexar Comprovante" onClick={() => triggerFileUpload('deadline_draft_file')}>
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Deadline VGM</Label>
                                <div className="flex items-center gap-2">
                                <DatePicker date={formData.deadline_vgm} onDateChange={date => handleInputChange('deadline_vgm', date)} showTime />
                                 {formData.deadline_vgm_file ? (
                                    <div className="flex items-center gap-1">
                                        <a href={formData.deadline_vgm_file.url} download={formData.deadline_vgm_file.name} title={`Descarregar ${formData.deadline_vgm_file.name}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                            <Download className="h-4 w-4 text-green-600" />
                                        </a>
                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeFile('deadline_vgm_file')} className="text-destructive hover:text-destructive" title="Remover anexo">
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="icon" type="button" title="Anexar Comprovante" onClick={() => triggerFileUpload('deadline_vgm_file')}>
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Deadline Carga</Label>
                                <div className="flex items-center gap-2">
                                <DatePicker date={formData.deadline_carga} onDateChange={date => handleInputChange('deadline_carga', date)} showTime />
                                  {formData.deadline_carga_file ? (
                                    <div className="flex items-center gap-1">
                                        <a href={formData.deadline_carga_file.url} download={formData.deadline_carga_file.name} title={`Descarregar ${formData.deadline_carga_file.name}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                            <Download className="h-4 w-4 text-green-600" />
                                        </a>
                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeFile('deadline_carga_file')} className="text-destructive hover:text-destructive" title="Remover anexo">
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="icon" type="button" title="Anexar Comprovante" onClick={() => triggerFileUpload('deadline_carga_file')}>
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                )}
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" disabled={!isEditing}>
             <AccordionTrigger>
                 <div className='flex items-center gap-3'>
                    {getStepStatusIcon(2)}
                    <div className='text-left'>
                        <h3 className="text-lg font-semibold">Etapa 2: Gestão de Documentos (Drafts)</h3>
                        <p className='text-sm text-muted-foreground'>Gere e envie os drafts de BL, Fito e Origem para aprovação do cliente.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-base'>Anexar Documentos de Draft</CardTitle>
                        <CardDescription>Carregue os ficheiros PDF para os drafts do BL, Fito e Certificado de Origem.</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6 pt-6'>
                         <div className="space-y-2">
                            <Label>Draft BL (Bill of Lading)</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    value={formData.draft_bl_file ? formData.draft_bl_file.name : 'Nenhum ficheiro anexado.'}
                                    readOnly
                                    className="flex-1"
                                />
                                {formData.draft_bl_file ? (
                                    <div className="flex items-center gap-1">
                                        <a href={formData.draft_bl_file.url} download={formData.draft_bl_file.name} title={`Descarregar ${formData.draft_bl_file.name}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                            <Download className="h-4 w-4 text-green-600" />
                                        </a>
                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeFile('draft_bl_file')} className="text-destructive hover:text-destructive" title="Remover anexo">
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="icon" type="button" title="Anexar Draft BL" onClick={() => triggerFileUpload('draft_bl_file')}>
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Draft Certificado Fitossanitário</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    value={formData.draft_fito_file ? formData.draft_fito_file.name : 'Nenhum ficheiro anexado.'}
                                    readOnly
                                    className="flex-1"
                                />
                                {formData.draft_fito_file ? (
                                    <div className="flex items-center gap-1">
                                        <a href={formData.draft_fito_file.url} download={formData.draft_fito_file.name} title={`Descarregar ${formData.draft_fito_file.name}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                            <Download className="h-4 w-4 text-green-600" />
                                        </a>
                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeFile('draft_fito_file')} className="text-destructive hover:text-destructive" title="Remover anexo">
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="icon" type="button" title="Anexar Draft Fito" onClick={() => triggerFileUpload('draft_fito_file')}>
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Draft Certificado de Origem</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    value={formData.draft_co_file ? formData.draft_co_file.name : 'Nenhum ficheiro anexado.'}
                                    readOnly
                                    className="flex-1"
                                />
                                {formData.draft_co_file ? (
                                    <div className="flex items-center gap-1">
                                        <a href={formData.draft_co_file.url} download={formData.draft_co_file.name} title={`Descarregar ${formData.draft_co_file.name}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                            <Download className="h-4 w-4 text-green-600" />
                                        </a>
                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeFile('draft_co_file')} className="text-destructive hover:text-destructive" title="Remover anexo">
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="icon" type="button" title="Anexar Draft Origem" onClick={() => triggerFileUpload('draft_co_file')}>
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" disabled={!isEditing}>
             <AccordionTrigger>
                 <div className='flex items-center gap-3'>
                    {getStepStatusIcon(3)}
                    <div className='text-left'>
                        <h3 className="text-lg font-semibold">Etapa 3: Liberação Física, Fiscal e Inspeção</h3>
                        <p className='text-sm text-muted-foreground'>Gerencie NFs, contêineres, desembaraço e inspeção MAPA.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="space-y-6 pt-6">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-medium">Notas Fiscais</h3>
                                <div className="flex items-center gap-2">
                                    {formData.notas_fiscais.length > 0 && (
                                        <Button type="button" variant="secondary" size="sm" onClick={generateNFsPdf}>
                                            <FileDown className="mr-2 h-4 w-4" />
                                            Baixar Pacote de NFs
                                        </Button>
                                    )}
                                    <Button type="button" variant="outline" size="sm" onClick={() => nfFileInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Carregar Notas Fiscais
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {formData.notas_fiscais.map((nota: any, index: number) => (
                                <div key={nota.id} className="grid md:grid-cols-6 gap-4 items-end p-3 border rounded-md">
                                    <div className="space-y-2">
                                        <Label>Tipo</Label>
                                        <Select value={nota.tipo} onValueChange={(value) => handleNotaFiscalChange(index, 'tipo', value)}>
                                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                            <SelectContent>
                                            <SelectItem value="Remessa">Remessa</SelectItem>
                                            <SelectItem value="Retorno">NF do Produtor</SelectItem>
                                            <SelectItem value="Exportação">Exportação</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label>Chave de Acesso / Anexo</Label>
                                        <div className='flex gap-2'>
                                            <Input 
                                                value={nota.chave || (nota.file ? nota.file.name : '')}
                                                onChange={(e) => handleNotaFiscalChange(index, 'chave', e.target.value)}
                                                placeholder="Chave da NF (auto-preenchida)"
                                                disabled={!nota.chave && !!nota.file}
                                            />
                                            {nota.file ? (
                                                <div className="flex items-center gap-1">
                                                     <a href={nota.file.url} download={nota.file.name} title={`Descarregar ${nota.file.name}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                                        <Download className="h-4 w-4 text-green-600" />
                                                    </a>
                                                    <Button variant="ghost" size="icon" type="button" title="Remover Anexo" onClick={() => handleNotaFiscalChange(index, 'file', null)} className="text-destructive hover:text-destructive">
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button variant="outline" size="icon" type="button" title="Anexar XML/PDF" onClick={() => triggerFileUpload({ type: 'nota_fiscal', index })}><FileUp className="h-4 w-4" /></Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Data Solicitação</Label>
                                        <DatePicker date={nota.data_pedido} onDateChange={(date) => handleNotaFiscalChange(index, 'data_pedido', date)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Data Recebimento</Label>
                                        <DatePicker date={nota.data_recebida} onDateChange={(date) => handleNotaFiscalChange(index, 'data_recebida', date)} />
                                    </div>
                                    <div className='flex items-end'>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeNotaFiscal(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                                ))}
                                {formData.notas_fiscais.length === 0 && <p className='text-sm text-center text-muted-foreground py-4'>Nenhuma nota fiscal adicionada.</p>}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-medium">Dados dos Contêineres</h3>
                                <div className='flex items-center gap-2'>
                                    <Button onClick={handleImportClick} disabled={isImporting} type="button" variant="outline" size="sm">
                                        {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                                        {isImporting ? 'A Importar...' : 'Importar Planilha (XLSX)'}
                                    </Button>
                                    <Button onClick={handleDownloadTemplate} type="button" variant="secondary" size="sm">
                                        <Download className="mr-2 h-4 w-4" />
                                        Descarregar Template
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={addContainer}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Adicionar Contêiner
                                    </Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nº Contêiner</TableHead>
                                            <TableHead>Lacre</TableHead>
                                            <TableHead>TARE</TableHead>
                                            <TableHead>QTY Espécie</TableHead>
                                            <TableHead>Gross Weight</TableHead>
                                            <TableHead>Net Weight</TableHead>
                                            <TableHead>M³</TableHead>
                                            <TableHead>VGM (kg)</TableHead>
                                            <TableHead>Ação</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {formData.containers.map((container:any, index:number) => (
                                            <TableRow key={index}>
                                                <TableCell><Input className="min-w-[150px]" value={container.numero || ''} onChange={e => handleContainerChange(index, 'numero', e.target.value)} placeholder="Ex: MSCU1234567" /></TableCell>
                                                <TableCell><Input className="min-w-[120px]" value={container.lacre || ''} onChange={e => handleContainerChange(index, 'lacre', e.target.value)} placeholder="Ex: SEAL123" /></TableCell>
                                                <TableCell><Input className="min-w-[100px]" value={container.tare || ''} onChange={e => handleContainerChange(index, 'tare', e.target.value)} /></TableCell>
                                                <TableCell><Input className="min-w-[120px]" value={container.qty_especie || ''} onChange={e => handleContainerChange(index, 'qty_especie', e.target.value)} /></TableCell>
                                                <TableCell><Input className="min-w-[120px]" value={container.gross_weight || ''} onChange={e => handleContainerChange(index, 'gross_weight', e.target.value)} /></TableCell>
                                                <TableCell><Input className="min-w-[120px]" value={container.net_weight || ''} onChange={e => handleContainerChange(index, 'net_weight', e.target.value)} /></TableCell>
                                                <TableCell><Input className="min-w-[100px]" value={container.m3 || ''} onChange={e => handleContainerChange(index, 'm3', e.target.value)} /></TableCell>
                                                <TableCell><Input className="min-w-[120px]" value={container.vgm || ''} type="number" onChange={e => handleContainerChange(index, 'vgm', e.target.value)} placeholder="Ex: 25000" /></TableCell>
                                                <TableCell>
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeContainer(index)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        <div className='grid md:grid-cols-2 gap-4 items-end'>
                            <div className="space-y-2">
                                <Label htmlFor="due_numero">Nº da DUE</Label>
                                <Input id="due_numero" value={formData.due_numero || ''} onChange={e => handleInputChange('due_numero', e.target.value)} placeholder="Ex: 24BR0001234567" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="due_status">Status da DUE</Label>
                                <div className='flex items-center gap-2'>
                                <Select value={formData.due_status || ''} onValueChange={value => handleInputChange('due_status', value)}>
                                    <SelectTrigger id="due_status">
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dueStatusOptions.map(status => (
                                          <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formData.due_file ? (
                                    <div className="flex items-center gap-1">
                                        <a href={formData.due_file.url} download={formData.due_file.name} title={`Descarregar ${formData.due_file.name}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                            <Download className="h-4 w-4 text-green-600" />
                                        </a>
                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeFile('due_file')} className="text-destructive hover:text-destructive" title="Remover anexo">
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="icon" type="button" title="Anexar DUE" onClick={() => triggerFileUpload('due_file')}>
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                )}
                                </div>
                            </div>
                        </div>
                         <div className="grid md:grid-cols-2 gap-4 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="lpco_protocolo">Protocolo LPCO</Label>
                                <Input id="lpco_protocolo" value={formData.lpco_protocolo || ''} onChange={e => handleInputChange('lpco_protocolo', e.target.value)} placeholder="Ex: E2500273876" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mapa_status">Status da Inspeção MAPA (LPCO)</Label>
                                <div className="flex items-center gap-2">
                                <Select value={formData.mapa_status || ''} onValueChange={value => handleInputChange('mapa_status', value)}>
                                    <SelectTrigger id="mapa_status">
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                         {lpcoStatusOptions.map(status => (
                                          <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formData.lpco_file ? (
                                    <div className="flex items-center gap-1">
                                        <a href={formData.lpco_file.url} download={formData.lpco_file.name} title={`Descarregar ${formData.lpco_file.name}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                            <Download className="h-4 w-4 text-green-600" />
                                        </a>
                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeFile('lpco_file')} className="text-destructive hover:text-destructive" title="Remover anexo">
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="icon" type="button" title="Anexar LPCO" onClick={() => triggerFileUpload('lpco_file')}>
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-md font-medium mb-2">Contêineres para Inspeção</h3>
                            <div className="space-y-2 rounded-md border p-4">
                            {formData.containers.map((container:any, index:number) => (
                                <div key={container.id} className="flex items-center gap-4">
                                    <Checkbox 
                                        id={`inspecionado-${container.id}`} 
                                        checked={container.inspecionado} 
                                        onCheckedChange={(checked) => handleContainerChange(index, 'inspecionado', !!checked)}
                                    />
                                    <Label htmlFor={`inspecionado-${container.id}`} className="flex-1 font-normal">{container.numero || `Contêiner ${index + 1}`}</Label>
                                    {container.inspecionado && (
                                        <Input 
                                            value={container.novo_lacre || ''} 
                                            onChange={e => handleContainerChange(index, 'novo_lacre', e.target.value)} 
                                            placeholder="Novo Lacre" 
                                            className="h-8 max-w-xs"
                                        />
                                    )}
                                </div>
                            ))}
                            {formData.containers.length === 0 && (
                                <p className="text-sm text-muted-foreground">Nenhum contêiner adicionado.</p>
                            )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </AccordionContent>
          </AccordionItem>
          
            <AccordionItem value="item-4" disabled={!isEditing}>
                <AccordionTrigger>
                    <div className='flex items-center gap-3'>
                        {getStepStatusIcon(4)}
                        <div className='text-left'>
                            <h3 className="text-lg font-semibold">Etapa 4: Confirmação de Embarque</h3>
                            <p className='text-sm text-muted-foreground'>Confirme os dados finais do embarque.</p>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                             <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Data de Saída (ETD)</Label>
                                    <DatePicker date={formData.etd} onDateChange={date => handleInputChange('etd', date)} showTime />
                                </div>
                                <div className="space-y-2">
                                    <Label>Data de Chegada (ETA)</Label>
                                    <DatePicker date={formData.eta} onDateChange={date => handleInputChange('eta', date)} showTime />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>

           <AccordionItem value="item-5" disabled={!isEditing}>
             <AccordionTrigger>
                 <div className='flex items-center gap-3'>
                    {getStepStatusIcon(5)}
                    <div className='text-left'>
                        <h3 className="text-lg font-semibold">Etapa 5: Gestão de Documentos Pós-Embarque</h3>
                        <p className='text-sm text-muted-foreground'>Gerencie a coleta e o envio dos documentos finais.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="space-y-6 pt-6">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-medium">Documentos Finais</h3>
                                <Button type="button" variant="outline" size="sm" onClick={addPostShipmentDoc}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Adicionar Documento
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Documento</TableHead>
                                        <TableHead>Qtd. Originais</TableHead>
                                        <TableHead>Qtd. Cópias</TableHead>
                                        <TableHead>Data Emissão</TableHead>
                                        <TableHead>Data Liberação</TableHead>
                                        <TableHead>Anexo</TableHead>
                                        <TableHead>Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {formData.documentos_pos_embarque.map((docItem: any, index: number) => (
                                        <TableRow key={docItem.id}>
                                            <TableCell>
                                                <Select value={docItem.nome || ''} onValueChange={value => handlePostShipmentDocChange(index, 'nome', value)}>
                                                    <SelectTrigger className="min-w-[180px]"><SelectValue placeholder="Selecione"/></SelectTrigger>
                                                    <SelectContent>
                                                        {documentTypes.map(type => (
                                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input className="w-24" type="number" min="0" value={docItem.originais || '0'} onChange={e => handlePostShipmentDocChange(index, 'originais', e.target.value)} />
                                            </TableCell>
                                            <TableCell>
                                                <Input className="w-24" type="number" min="0" value={docItem.copias || '0'} onChange={e => handlePostShipmentDocChange(index, 'copias', e.target.value)} />
                                            </TableCell>
                                            <TableCell>
                                                <DatePicker 
                                                    date={docItem.data_emissao} 
                                                    onDateChange={date => handlePostShipmentDocChange(index, 'data_emissao', date)} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <DatePicker 
                                                    date={docItem.data_liberacao} 
                                                    onDateChange={date => handlePostShipmentDocChange(index, 'data_liberacao', date)} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                 {docItem.file ? (
                                                    <div className="flex items-center gap-1">
                                                        <a href={docItem.file.url} download={docItem.file.name} title={`Descarregar ${docItem.file.name}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                                            <Download className="h-4 w-4 text-green-600" />
                                                        </a>
                                                        <Button variant="ghost" size="icon" type="button" title="Remover Anexo" onClick={() => removeFile({ type: 'documento_pos_embarque', index })} className="text-destructive hover:text-destructive">
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button variant="outline" size="icon" type="button" title="Anexar" onClick={() => triggerFileUpload({ type: 'documento_pos_embarque', index })}>
                                                        <Upload className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removePostShipmentDoc(index)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </div>
                        
                        <div className='flex items-end gap-4'>
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="awb_courier">AWB do Courier (Envio)</Label>
                                <Input id="awb_courier" value={formData.awb_courier || ''} onChange={e => handleInputChange('awb_courier', e.target.value)} placeholder="Insira o código de rastreio" />
                            </div>
                            <Button type="button" variant="outline" onClick={generateOriginalDocsPdf}>
                                <FileDown className="mr-2 h-4 w-4" />
                                Gerar Pacote PDF
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </AccordionContent>
          </AccordionItem>
          
           <AccordionItem value="item-6" disabled={!isEditing}>
             <AccordionTrigger>
                 <div className='flex items-center gap-3'>
                    {getStepStatusIcon(6)}
                    <div className='text-left'>
                        <h3 className="text-lg font-semibold">Etapa 6: Encerramento do Processo</h3>
                        <p className='text-sm text-muted-foreground'>Conclua o processo e arquive todo o histórico.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="space-y-6 pt-6">
                       <div className='text-center py-4'>
                         <p className='text-lg font-semibold'>Processo pronto para ser finalizado.</p>
                         <p className='text-muted-foreground'>Verifique se o AWB do courier foi inserido na Etapa 5. Ao concluir, o status do processo será alterado para "Concluído" e sairá da lista de processos ativos.</p>
                       </div>
                        <Button className='w-full' onClick={() => handleInputChange('status', 'Concluído')}>
                            <CheckCircle className='mr-2 h-4 w-4' />
                            Concluir e Arquivar Processo
                        </Button>
                    </CardContent>
                </Card>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </form>
    </div>
  );
}
