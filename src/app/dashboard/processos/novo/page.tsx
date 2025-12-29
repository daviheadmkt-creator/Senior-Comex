

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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


const initialDocuments: any[] = [];

const initialOriginalDocs = [
    { id: 'bl_original', name: 'Coletar Bill of Lading (B/L) Original', done: false, isSubtask: false, completionDate: null },
    { id: 'coo_original', name: 'Emitir Certificado de Origem (COO) Original', done: false, isSubtask: false, completionDate: null },
    { id: 'fito_original', name: 'Emitir Certificado Fitossanitário (FITO) Original', done: false, isSubtask: false, completionDate: null },
    { id: 'pagamento_cert', name: 'Processar Pagamento de Certificados', done: false, isSubtask: true, completionDate: null },
]

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
    exportadorNome: '',
    portoEmbarqueNome: '',
    portoDescargaNome: '',
    destino: '',
    status: 'Iniciado / Aguardando Booking',
    booking_number: '',
    armadorId: '',
    navio: '',
    viagem: '',
    documentos: initialDocuments,
    containers: [] as any[],
    bls: [] as any[],
    notas_fiscais: [] as any[],
    due_numero: '',
    due_status: 'RASCUNHO SALVO',
    lpco_protocolo: '',
    mapa_status: 'RASCUNHO SALVO',
    navio_final: '',
    viagem_final: '',
    documentos_originais: initialOriginalDocs,
    awb_courier: '',
    analistaId: '',
    analistaNome: '',
    draft_bl_shipper: '',
    draft_bl_consignee: '',
    draft_bl_notify: '',
    draft_bl_marks: '',
    draft_bl_port_loading: '',
    draft_bl_port_discharge: '',
    draft_bl_description: '',
    draft_fito_consignee: '',
    draft_fito_description: '',
    draft_fito_treatment: '',
    draft_fito_chemical: '',
    draft_fito_concentration: '',
    draft_fito_date: '',
    draft_co_consignee: '',
    draft_co_description: '',
    draft_co_hs_code: '',
    draft_co_invoice: '',
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
  const [uploadTarget, setUploadTarget] = useState<string | { type: 'nota_fiscal', index: number } | { type: 'documento', index: number } | null>(null);
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
      const newContacts = selectedExporter?.contatos?.filter((c: any) => c.nome).map((c, index) => ({...c, id: index })) || [];
      setExporterContacts(newContacts);

      setFormData({
        ...initialFormData,
        ...processoData,
        data_nomeacao: processoData.data_nomeacao || null,
        deadline_draft: processoData.deadline_draft || null,
        deadline_vgm: processoData.deadline_vgm || null,
        deadline_carga: processoData.deadline_carga || null,
        etd: processoData.etd || null,
        eta: processoData.eta || null,
        documentos: processoData.documentos || initialDocuments,
        containers: processoData.containers || [],
        bls: processoData.bls || [],
        notas_fiscais: processoData.notas_fiscais || [],
        documentos_originais: processoData.documentos_originais || initialOriginalDocs,
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
            const newState = { ...prev, [id]: value ?? '' };

            // Logic to automatically update status
            const currentStatus = newState.status;
            let nextStatus = currentStatus;

            const statusNumber = processStatusOptions.indexOf(currentStatus);
            const draftsApprovedOrLater = statusNumber >= processStatusOptions.indexOf("DRAFTS_APROVADOS");

            if (currentStatus === "Iniciado / Aguardando Booking" && newState.booking_number) {
                nextStatus = "Booking Confirmado / Aguardando Draft";
            } else if (currentStatus === "Booking Confirmado / Aguardando Draft" || currentStatus === "CORRECAO_DE_DRAFT_SOLICITADA") {
                 if(newState.draft_bl_shipper || newState.draft_bl_consignee || newState.draft_bl_description || newState.draft_fito_consignee || newState.draft_fito_description || newState.draft_co_consignee || newState.draft_co_description) {
                    nextStatus = "DRAFTS_EM_APROVAÇÃO";
                 }
            } else if (id === 'status' && value === 'DRAFTS_APROVADOS') { // Manual trigger
                nextStatus = "AGUARDANDO_EMISSAO_NF_EXPORTACAO";
            } else if (draftsApprovedOrLater && newState.due_status === "DESEMBARAÇADA" && newState.mapa_status === "DEFERIDA") {
                nextStatus = "PRONTO_PARA_EMBARQUE";
            } else if (currentStatus === "PRONTO_PARA_EMBARQUE" && newState.bls?.length > 0 && newState.bls.every((bl: any) => bl.numero)) {
                nextStatus = "Em trânsito";
            } else if (currentStatus === "Em trânsito" && newState.documentos_originais?.every((doc: any) => doc.done)) {
                nextStatus = "DOCUMENTOS_ORIGINAIS_COLETADOS / AGUARDANDO_ENVIO";
            } else if (currentStatus.startsWith("DOCUMENTOS_ORIGINAIS_COLETADOS") && newState.awb_courier) {
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

    const fileData = {
        name: file.name,
        url: URL.createObjectURL(file), 
    };
    
    if (typeof uploadTarget === 'string') {
        handleInputChange(uploadTarget, fileData);
    } else if (typeof uploadTarget === 'object') {
        if (uploadTarget.type === 'nota_fiscal') {
            const { index } = uploadTarget;
            handleNotaFiscalChange(index, 'file', fileData);

            if (file.name.toLowerCase().endsWith('.xml')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const xmlText = event.target?.result as string;
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
                };
                reader.readAsText(file);
            }
        } else if (uploadTarget.type === 'documento') {
            const { index } = uploadTarget;
            handleDocumentChange(index, 'file', fileData);
        }
    }


    toast({
        title: "Ficheiro Anexado",
        description: `${file.name} foi anexado com sucesso.`,
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadTarget(null);
  };

  const triggerFileUpload = (target: string | object) => {
    setUploadTarget(target as any);
    fileInputRef.current?.click();
  };

  const removeFile = (target: string | {type: 'nota_fiscal', index: number} | {type: 'documento', index: number}) => {
    if (typeof target === 'string') {
      handleInputChange(target, null);
    } else if (typeof target === 'object') {
        if (target.type === 'nota_fiscal') {
            handleNotaFiscalChange(target.index, 'file', null);
        } else if (target.type === 'documento') {
            handleDocumentChange(target.index, 'file', null);
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
  
  const handleBlChange = (index: number, field: string, value: string | null) => {
    const updatedBls = [...formData.bls];
    (updatedBls[index] as any)[field] = value;
    setFormData(prev => ({...prev, bls: updatedBls}));
  };

  const handleDocumentChange = (index: number, field: string, value: any) => {
    const updatedDocuments = [...formData.documentos];
    (updatedDocuments[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, documentos: updatedDocuments }));
  };

  const addDocument = () => {
    setFormData(prev => ({
        ...prev,
        documentos: [...prev.documentos, { id: Date.now(), name: '', status: 'Aguardando Envio', date: '', file: null }]
    }));
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = formData.documentos.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, documentos: updatedDocuments }));
  };
  
  const handleNotaFiscalChange = (index: number, field: string, value: any) => {
    const updatedNotas = [...formData.notas_fiscais];
    (updatedNotas[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, notas_fiscais: updatedNotas }));
  };

  const addNotaFiscal = () => {
    setFormData(prev => ({
      ...prev,
      notas_fiscais: [
        ...prev.notas_fiscais,
        { id: Date.now(), tipo: 'Remessa', chave: '', file: null }
      ]
    }));
  };

  const removeNotaFiscal = (index: number) => {
    const updatedNotas = formData.notas_fiscais.filter((_: any, i: number) => i !== index);
    setFormData(prev => ({ ...prev, notas_fiscais: updatedNotas }));
  };
  
  const handleOriginalDocChange = (docId: string, checked: boolean) => {
    const updatedDocs = formData.documentos_originais.map(doc => 
        doc.id === docId ? {...doc, done: checked, completionDate: checked ? new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null } : doc
    );
     setFormData(prev => ({...prev, documentos_originais: updatedDocs}));
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
  
  const addBl = () => {
    setFormData(prev => ({
        ...prev,
        bls: [...prev.bls, { id: Date.now(), numero: '', tipo: 'BL', data_emissao: null, data_liberacao: null, data_retirada: null }]
    }));
  };

  const removeBl = (index: number) => {
    const updatedBls = formData.bls.filter((_, i) => i !== index);
    setFormData(prev => ({...prev, bls: updatedBls}));
  };

  const handleDocumentStatusChange = (index: number, newStatus: string) => {
      const updatedDocuments = [...formData.documentos];
      updatedDocuments[index].status = newStatus;
      updatedDocuments[index].date = new Date().toLocaleDateString('pt-BR');
      setFormData(prev => ({ ...prev, documentos: updatedDocuments }));
      toast({ title: `Status do documento "${updatedDocuments[index].name}" atualizado para ${newStatus}!` });
  }

  const getDocStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Aprovado':
            return 'default';
        case 'Em Análise':
            return 'secondary';
        case 'Rejeitado':
            return 'destructive';
        case 'Aguardando Envio':
            return 'outline';
        default:
            return 'outline';
    }
  }

 const getStepStatusIcon = (step: number) => {
    const { 
        status, booking_number, due_status, mapa_status, bls, documentos_originais, awb_courier,
        notas_fiscais, containers, navio_final, viagem_final, etd, eta
    } = formData;

    const allOriginalDocsDone = documentos_originais.every((d:any) => d.done);
    const statusNumber = processStatusOptions.indexOf(status);
    
    switch (step) {
        case 1: // Nomeação + Booking
            if (booking_number) return <CheckCircle className="h-5 w-5 text-green-500" />;
            return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
        case 2: // Drafts
             if (status === 'CORRECAO_DE_DRAFT_SOLICITADA') return <XCircle className="h-5 w-5 text-red-500" />;
             const draftsApprovedOrLater = statusNumber >= processStatusOptions.indexOf("DRAFTS_APROVADOS");
             if (draftsApprovedOrLater) return <CheckCircle className="h-5 w-5 text-green-500" />;
             if (booking_number) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
             return <XCircle className="h-5 w-5 text-gray-400" />;
        case 3: // Liberação Física, Fiscal e Inspeção
            const isDueOk = due_status === 'DESEMBARAÇADA' || due_status === 'AVERBADA';
            const isMapaOk = mapa_status === 'DEFERIDA' || mapa_status === 'DEFERIDA/CERTIFICADO EMITIDO';
            const areNFsOk = notas_fiscais.length > 0 && notas_fiscais.every((nf:any) => nf.chave);
            const areContainersOk = containers.length > 0 && containers.every((c:any) => c.numero && c.lacre && (!c.inspecionado || (c.inspecionado && c.novo_lacre)));

            if (isDueOk && isMapaOk && areNFsOk && areContainersOk) {
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            }
            if (mapa_status === 'INDEFERIDA') return <XCircle className="h-5 w-5 text-red-500" />;
            if (status && statusNumber >= processStatusOptions.indexOf("DRAFTS_APROVADOS")) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
            return <XCircle className="h-5 w-5 text-gray-400" />;
        case 4: // Embarque
            if (navio_final && viagem_final) return <CheckCircle className="h-5 w-5 text-green-500" />;
            const isReadyForShipment = statusNumber >= processStatusOptions.indexOf("PRONTO_PARA_EMBARQUE");
            if(isReadyForShipment) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
            return <XCircle className="h-5 w-5 text-gray-400" />;
        case 5: // Docs Originais
            if (allOriginalDocsDone) return <CheckCircle className="h-5 w-5 text-green-500" />;
            if (bls && bls.length > 0) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
            return <XCircle className="h-5 w-5 text-gray-400" />;
        case 6: // Encerramento
            if (awb_courier) return <CheckCircle className="h-5 w-5 text-green-500" />;
            if (allOriginalDocsDone) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
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
    const enrichedContacts = updatedContacts.map((c, i) => ({ ...c, id: String(i) }));
    setExporterContacts(enrichedContacts);

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

    const generatePdf = async () => {
        const doc = new jsPDF();
        
        // ======== DRAFT FITO (Phytosanitary Certificate) ========
        const govLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAA/MSURBVHhe7Z1/aJVVFMd/t+k1l5qWloVpWf+sRSErtExLdLP3RNEyN5MUhSwo5o/FDVlIjT+Sj+aP0YyIJiMZWkRoS0lEQjQzvUmdIZs98/Ke5tL7nXO7e+973/vOfe895/2DBx53d/fe875z3vM9576PBAAAAAAAAGu8tLSUyvP5VFlZWfT19bGysrKqL4hTUtuS7u/vr6a+vj6qO5/Pq3a73c0lJSXVX3wA4yU+Pj5qNpv1A8BffgBjnOnp6dUwGNRL/P391YV8Pj+93W41oFBfX19zMpn0t3gAo5lMJgMA/MUnYIyNjY1qtVrpU2tra2tMTIxaW1srgwGAr7i0tNTd6g8AAABgpYTAAQAAwCkJwAEAAOCUBOAAAADglAQcAAAAHEqgR0+f+tT4qR8fP35y/MSpqVOn1lVjY2M/PjEx8bN3P3s0k05e3vfeP3P61P1Pnf/c1avXf7l06f8cO3Ys5eOPP46SkZER/gAAwDoJ9OjRo6mSkhLq7e29b/X19alxcXGqoaHB+uQfP36c3t7e6tChQ+uGDhxIra2tVUhIiPrqq6+GSUlJVFVV9d7/xIkTKS4uLnV0dFTZ2dnV0dFh/fF///tfmpmZSV1dXVd+/PFH5+bm+sN/+/btU3V1dfXJJ59MXl7ee7d+/XqamJjo6urq1q9fn1pbW1948MEH0+uvv97v5cuXT6dOndrvt99+O83Nza3Onj2bGhgYSOvXr3/vjIyMKCsrK4WEhKSKigprA/4nJyeTlpYWde/eXR0dHVVZWVk0NjaWDh8+nMLCwqrDww+n8vJy8s3IyEhdXV1VVVWVyvP5qfV6Xf3gDqZNmzb18+fP0/jx41NdXV0Vi4uLqaioSF1dXVXh4eHqeDxWd3d3lZGRQY2NjdXy8nI1GAxSS0uL+vbbb9e/+Ph4SkpKisrKyqivr08dHR0tLCwslJWVRQ0NDVVjY6Pq7u6u7u7uKiUlhebm5qqxsZEqKirSO++8U7m5uVVdXV01mUxmH5+Xl0fPnj2bvvvuO3VwcFD19fVVd3f3NXPmzOrr66tCQkKoS5cu0datWysA2LJlS/PmzZvp+PHjVV9fn/rzzz/TsGHDKn/+/CkgR0dHVxMTEysrKysBAMvLy1NdXV1VVlZWNTQ01PHx8asBAQGA/zXk5+dXb9++VQDYu3dvOnbsWPr6669Xf3//df369TUvLy/LyMiw+k1ZWVkKAAUGBgIA2NnZqbNnz65OnTpFXV1d6ujoqNLS0qoZM2aQu3fv3r148eK1J0+eVH9/fzU6OnrdvHmzdnh4WFlZWRW/r8iRI4cCAObMmXPdunUrhYSEVGfPnl3t7OzU4OCgKjg4mLKysqrGxkZVVVX1R+F9ff2VlZX1x3eMHDlSBYBDhw5dp0+frhYWFsqKigrLy8urDh8+nIKCguov/vbt26uysrJ1xIgR1WuvvbbdsWMHAb9n3rhxo/rgDqZOnTrV3d3dFRgYSGFhYVVuL/QG3u7u7qrBYFDZ2dl0/vx5CgwMrP6/mzdv3gYGBq579+5lV1dXlZ6eXoWEhKSjR4+mU6dOJbNmzaJz586lJUuWVGFhYYqMjExFRUXVt99+uw4cONDatWsHAMydO5fKy8ujJk2apP7yl79sv/POO9P69evfOzs72/7hhx9SVlZW2tjYqMaNG0ednZ0VHh5e+fDhg9rY2Kj169fX7Nmza05OTuR+/frVt956qx4/fpxqamqqpKQkuRcvXoySk5OrqKhIDQ0Nlfn5+TU4OJiKi4urOjo6XvunpKSk/qO//vprSkpKSrFYLJWamlo1NTVR8+bNAwD69+9PxcXFlZaWVmVnZ1eLxaKxWKzKlClT6quvvlq//PLLr7NmzbovLy+vtm/fvo4cOZK6uropIyOjWlhYqGXLlr2/ffv2lZaWVl1cXBzX1tZuBwcHFYDLly+v3rx5czs6OqrvvfdeysrKqj777LM1NDSUkpOTKy4uzvr8O3TokBYtWtTvAwcOrF28ePGvKisrV0FBQRXkR0dH9zNnzqxFixbV7t27q/j4+Cs7OzslJCSkxsbG6osvvrgGBQVVP/3001vT09MbN26cOXXq1JXXr1/n2rVr6ebNm6uLi4t08+bN5bvvvlurq6tT7969q6urq0uXLp1KaWlpFR4eXh0cHFy/ePGilZeXVyYmJiqjI7O83k9KSvqvT58+r1OnTq1jYmJq165ddXFxca1YsWJqbm6uSkpKqn7+85+vtLS0Kjc3t3rxxRfXbt269d7FixfXrl69+t6mTZuud+7cSVVVVTV//vwUFhZWPXnyZNrnJyQkbNy4capZs2ZVdnZ2xWIx6tGjh9LS0tL8/Pzq3LkzFR4eXiNHjqyZM2cuAwA8PT2VoaEhdeWVV1ZzcnJSWVlZ5eLiUqurq6uKigrl7+9fXl1drREREWl6evqGhoZq3bx161aqqampXC63/Pz8lJSUlNbW1tXVq1dXJkyapPbaa6+k2bNn05AhQ6qPPvqIJiMjozZs2LCPHz9eL1++nJaXl9c8PT3V2rVrq+jo6DU1NVV9fX3VmTNn1sePH6deeeWVKi4ubnFxcTU2NlZhYWGVm5tbeXl5qVOnTq0ePnyYHjx4UAcHB6sLFy6sgoIC6tVXX62goICys7Pz2bNna/v27VVdXV1VUlJSHR0d5f+o/09NTU1Nbd++ffvkyZNXpqamUllZWYV5eXlVfHx8Nf/+e5qRkUFDQ0M1Pz+/WlhYWlpaWtnZ2Vn+P6qrq1utVqvFYpHm5ubKz8+v/v7+Xbt2bfvBBx/8N2vWLC0sLKycnJwUl8vl0tLSUvPz8ys7O7taW1urYrH4/xWf+Ph46uLiIgcAAAAAYKWEgAEAAAAnJQAHAAABAEAAAAAHEgAMAAAACEkABgAAAEgkABgAAAIhJAAYAAAAIJAAZAAAASIAGAAAACEkAAAAAAyCIAAAAAACQBAAAAABgDCQAAAAAAwDiEAAAAAAASAAYAAAAIEgAAAAAAAEgAAAAAAEASAAaAAAAACCEAAAAAACQkABgAAAAAJICAAAAAACAEAAAAAAAAAxCQAAAAAAMA6CQAGAAAAAAkgBIAAAAAABgBAAAAAAAJIEgAMAAAASIAGAAAAABJAkAAAAAgBCQAAAAAQAyEAAAAACAEgAAAAAAAAxCQAAAAAAYByCQAAAAAADAEhAAAAAIhCQAAAAAAAA4hAAAAAAAMQ5CQAAAAAAYBwkABgAAAAAQSAAAAAAAADAEAAAAAAASAASAAAAAABAJAAAAAAAA/wC7oT1qY1Vz1gAAAABJRU5ErkJggg==';

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('CERTIFICADO FITOSSANITÁRIO', 105, 15, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('PHYTOSANITARY CERTIFICATE', 105, 20, { align: 'center' });
        
        try {
            doc.addImage(govLogo, 'PNG', 15, 8, 20, 20);
        } catch (e) {
            console.error("Error adding govLogo:", e);
        }

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('MINISTÉRIO DA AGRICULTURA, PECUÁRIA E ABASTECIMENTO', 105, 25, { align: 'center' });
        doc.text('DEPARTAMENTO DE SANIDADE VEGETAL', 105, 29, { align: 'center' });
        doc.text('ORGANIZAÇÃO NACIONAL DE PROTEÇÃO FITOSSANITÁRIA DO BRASIL', 105, 33, { align: 'center' });
        doc.text('PLANT PROTECTION ORGANIZATION OF BRAZIL', 105, 37, { align: 'center' });


        const drawTextBox = (x: number, y: number, width: number, height: number, label: string, text: string) => {
            doc.rect(x, y, width, height);
            doc.setFontSize(6);
            doc.setFont('helvetica', 'bold');
            doc.text(label, x + 1, y + 3);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(doc.splitTextToSize(text, width - 4), x + 2, y + 7);
        };
        
        // Fields
        drawTextBox(15, 40, 180, 10, '1. Para: Organização Nacional de Proteção Fitossanitária de / To: Plant Protection Organization(s) of', 'INDIA');
        drawTextBox(15, 50, 90, 20, '2. Nome e endereço do exportador / Name and address of exporter', formData.draft_bl_shipper || '');
        drawTextBox(105, 50, 90, 20, '3. Nome e endereço do destinatário declarado / Declared name and address of consignee', formData.draft_fito_consignee || '');
        drawTextBox(15, 70, 90, 10, '4. Lugar de Origem / Place of Origin', 'MATO GROSSO - BRASIL');
        drawTextBox(105, 70, 45, 10, '5. Meios de transporte declarados / Declared means of conveyance', 'MARÍTIMO / MARITIME');
        drawTextBox(150, 70, 45, 10, '6. Porto de descarga / Declared point of entry', formData.portoDescargaNome || '');

        
        const packageDesc = `SACAS DE POLIPROPILENO USADAS, LIMPAS E EM BOM ESTADO DE CONSERVAÇÃO CONTENDO ${formData.produtoNome.toUpperCase()} / USED POLYPROPYLENE BAGS, CLEAN AND IN GOOD STATE OF CONSERVATION CONTAINING ${formData.produtoNome.toUpperCase()}`
        drawTextBox(15, 80, 90, 20, '7. Número e descrição dos volumes / Number and description of packages', packageDesc);
        
        doc.rect(105, 80, 90, 20);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('8. Nome do produto e quantidade declarada / Name of product and quantity declared', 106, 83);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(doc.splitTextToSize(formData.draft_fito_description || '', 86), 107, 87);
        doc.text(doc.splitTextToSize(formData.quantidade || '', 86), 160, 95, {align: 'right'});

        drawTextBox(15, 100, 90, 10, '9. Marcas distintas / Distinguishing marks', `NAVIO / VESSEL:\n${formData.navio || ''}\n\nCONHECIMENTO DE EMBARQUE / BILL OF LADING: ${formData.bls?.[0]?.numero || ''}`);
        drawTextBox(105, 100, 90, 10, '10. Nome científico das plantas / Botanical name of plants', 'Sesamum indicum');

        drawTextBox(15, 110, 180, 20, '11. Pelo presente certifica-se que os vegetais, seus produtos ou outros artigos regulamentados aqui descritos foram inspecionados e/ou testados de acordo com os procedimentos oficiais adequados e considerados livres de pragas quarentenárias especificadas pela parte contratante importadora e que cumprem os requisitos fitossanitários vigentes da parte contratante importadora, incluídos os relativos às pragas não quarentenárias regulamentadas. / This is to certify that the plants, plant products or other regulated articles described herein have been inspected and/or tested according to appropriate official procedures and are considered to be free from the quarantine pests specified by the importing contracting party and to conform with the current phytosanitary requirements of the importing contracting party, including those for regulated non-quarantine pests.', '');

        // Additional Declaration
        drawTextBox(15, 130, 180, 20, 'DECLARAÇÃO ADICIONAL / ADDITIONAL DECLARATION', `DATA DE INSPEÇÃO...: ${formData.draft_fito_date || 'XX/NOV/2025'}\nINSPECTION DATE......: ${formData.draft_fito_date || 'NOV/XX/2025'}\n\nThe consignment is free from quarantine weed seeds and soil contamination.\nFIT FOR HUMAN CONSUMPTION.`);

        // Disinfection Treatment
        doc.rect(15, 150, 180, 5);
        doc.setFontSize(8).setFont('helvetica', 'bold').text('TRATAMENTO DE DESINFESTAÇÃO E/OU DESINFECÇÃO / DISINFESTATION AND/OR DISINFECTION TREATMENT', 105, 153.5, { align: 'center' });

        drawTextBox(15, 155, 30, 10, '12. Data do Tratamento / Date of Treatment', 'NONE');
        drawTextBox(45, 155, 30, 10, '13. Tratamento / Treatment', 'NONE');
        drawTextBox(75, 155, 30, 10, '14. Produto químico / Chemical (active ingredient)', 'NONE');
        drawTextBox(105, 155, 30, 10, '15. Concentração / Concentration', 'NONE');
        drawTextBox(135, 155, 30, 10, '16. Duração e Temperatura / Duration and Temperature', 'NONE');
        drawTextBox(165, 155, 30, 10, '17. Informação adicional / Additional information', 'NONE');
        
        // Footer
        drawTextBox(15, 165, 60, 20, '18. Carimbo da Organização / Stamp of organization', '');
        drawTextBox(75, 165, 60, 10, '19. Lugar de Expedição / Place of issue', '');
        drawTextBox(135, 165, 60, 10, '20. Data de emissão / Date of issue', '');
        drawTextBox(75, 175, 60, 10, '21. Nome do Fiscal Federal Agropecuário autorizado / Name of authorized officer', '');
        drawTextBox(135, 175, 60, 10, '22. Assinatura do Fiscal Federal Agropecuário autorizado / Signature of authorized officer', '');


        // ======== DRAFT BL (Bill of Lading) ========
        doc.addPage();
        const logoUrl = localStorage.getItem('system_logo');

        if (logoUrl) {
            try {
                doc.addImage(logoUrl, 'PNG', 15, 10, 50, 10);
            } catch (e) {
                console.error("Error adding company logo:", e);
            }
        }
        
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('DRAFT - BILL OF LADING', 105, 20, { align: 'center' });

        const drawBlBox = (x: number, y: number, width: number, height: number, label: string, text: string) => {
            doc.rect(x, y, width, height);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(label, x + 1, y + 4);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(doc.splitTextToSize(text, width - 4), x + 2, y + 10);
        };
        
        drawBlBox(15, 30, 90, 30, '1. Shipper', formData.draft_bl_shipper || '');
        drawBlBox(105, 30, 90, 30, '2. B/L No.', formData.bls?.[0]?.numero || '');
        drawBlBox(15, 60, 90, 30, '3. Consignee', formData.draft_bl_consignee || '');
        drawBlBox(105, 60, 90, 30, '4. Notify Party', formData.draft_bl_notify || '');
        drawBlBox(15, 90, 90, 20, '5. Vessel and Voyage', `${formData.navio || ''} / ${formData.viagem || ''}`);
        drawBlBox(105, 90, 90, 20, '6. Port of Loading', formData.portoEmbarqueNome || '');
        drawBlBox(15, 110, 90, 20, '7. Port of Discharge', formData.portoDescargaNome || '');
        drawBlBox(105, 110, 90, 20, '8. Final Destination', formData.portoDescargaNome || '');
        
        const containerText = formData.containers.map((c: any) => `${c.numero} / ${c.lacre} / ${c.gross_weight} KGS`).join('\n');
        drawBlBox(15, 130, 90, 40, '9. Container(s) and Seal(s)', containerText);
        drawBlBox(105, 130, 90, 40, '10. Marks and Numbers', formData.draft_bl_marks || '');
        drawBlBox(15, 170, 180, 40, '11. Description of Goods', `${formData.quantidade || ''}\n${formData.draft_bl_description || ''}`);


        doc.save(`Drafts_${formData.processo_interno || 'processo'}.pdf`);
        toast({
            title: "PDFs Gerados!",
            description: "Os drafts foram gerados com sucesso.",
        });
    };

    const generateOriginalDocsPdf = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text(`Documentos Originais - Processo: ${formData.processo_interno || 'N/A'}`, 14, 22);

        doc.setFontSize(14);
        doc.text('Conhecimentos de Embarque (BLs)', 14, 40);
        const blBody = formData.bls.map((bl: any) => [
            bl.numero,
            bl.data_emissao ? new Date(bl.data_emissao).toLocaleDateString('pt-BR') : '',
            bl.data_liberacao ? new Date(bl.data_liberacao).toLocaleDateString('pt-BR') : '',
        ]);
        (doc as any).autoTable({
            startY: 45,
            head: [['Nº do BL', 'Data Emissão', 'Data Liberação']],
            body: blBody,
            theme: 'grid',
            styles: { fontSize: 10 },
        });

        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(12);
        doc.text('Outros documentos serão adicionados aqui em futuras implementações.', 14, finalY + 10);


        doc.save(`Documentos_Originais_${formData.processo_interno || 'processo'}.pdf`);
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
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xml,.pdf" />
        <input
            type="file"
            ref={containerFileInputRef}
            onChange={handleContainerImport}
            className="hidden"
            accept=".xlsx, .xls"
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
                                     items={parceiros?.filter(p => p.tipo_parceiro === 'Exportador').sort((a, b) => a.nome_fantasia.localeCompare(b.nome_fantasia)).map(p => ({ value: p.id, label: `${p.nome_fantasia} | ${p.cnpj || 'N/A'}` })) || []}
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
                                <Label htmlFor="booking_number">Nº do Booking</Label>
                                <Input id="booking_number" value={formData.booking_number || ''} onChange={e => handleInputChange('booking_number', e.target.value)} placeholder="Insira o número do booking" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="armadorId">Armador</Label>
                                <Select value={String(formData.armadorId || '')} onValueChange={value => handleInputChange('armadorId', value)}>
                                    <SelectTrigger id="armadorId">
                                        <SelectValue placeholder={isLoadingParceiros ? "Carregando..." : "Selecione o armador"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {parceiros?.filter(p => p.tipo_parceiro === 'Armador').map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nome_fantasia}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="navio">Navio</Label>
                                <Input id="navio" value={formData.navio || ''} onChange={e => handleInputChange('navio', e.target.value)} placeholder="Ex: MSC EUGENIA" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="viagem">Viagem</Label>
                                <Input id="viagem" value={formData.viagem || ''} onChange={e => handleInputChange('viagem', e.target.value)} placeholder="Ex: NAS21R" />
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
                                        <a href={formData.deadline_draft_file.url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" type="button" title={formData.deadline_draft_file.name}>
                                                <Check className="h-4 w-4 text-green-600" />
                                            </Button>
                                        </a>
                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeFile('deadline_draft_file')} className="text-destructive hover:text-destructive">
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
                                        <a href={formData.deadline_vgm_file.url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" type="button" title={formData.deadline_vgm_file.name}>
                                                <Check className="h-4 w-4 text-green-600" />
                                            </Button>
                                        </a>
                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeFile('deadline_vgm_file')} className="text-destructive hover:text-destructive">
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
                                        <a href={formData.deadline_carga_file.url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" type="button" title={formData.deadline_carga_file.name}>
                                                <Check className="h-4 w-4 text-green-600" />
                                            </Button>
                                        </a>
                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeFile('deadline_carga_file')} className="text-destructive hover:text-destructive">
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
                        <div className="flex justify-between items-center">
                            <CardTitle className='text-base'>Dados para Geração de Drafts</CardTitle>
                             <Button size="sm" variant="outline" type="button" onClick={generatePdf}>
                                <FileDown className="mr-2 h-4 w-4" /> Gerar Pacote de Drafts (PDF)
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                       <Tabs defaultValue="bl" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="bl">Draft BL</TabsTrigger>
                                <TabsTrigger value="fito">Draft Fito</TabsTrigger>
                                <TabsTrigger value="co">Draft Origem</TabsTrigger>
                            </TabsList>
                            <TabsContent value="bl">
                                <div className="p-4 border rounded-lg space-y-4 mt-4">
                                     <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="draft_bl_shipper">Shipper (Exportador)</Label>
                                            <Textarea id="draft_bl_shipper" value={formData.draft_bl_shipper || ''} onChange={e => handleInputChange('draft_bl_shipper', e.target.value)} placeholder="Nome completo e endereço do exportador" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="draft_bl_consignee">Consignee (Importador)</Label>
                                            <Textarea id="draft_bl_consignee" value={formData.draft_bl_consignee || ''} onChange={e => handleInputChange('draft_bl_consignee', e.target.value)} placeholder="Nome completo e endereço do importador" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="draft_bl_notify">Notify Party (Notificar)</Label>
                                            <Textarea id="draft_bl_notify" value={formData.draft_bl_notify || ''} onChange={e => handleInputChange('draft_bl_notify', e.target.value)} placeholder="A quem notificar na chegada" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="draft_bl_marks">Marks and Numbers</Label>
                                            <Textarea id="draft_bl_marks" value={formData.draft_bl_marks || ''} onChange={e => handleInputChange('draft_bl_marks', e.target.value)} placeholder="Marcas e números dos pacotes" />
                                        </div>
                                         <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="draft_bl_description">Description of Goods</Label>
                                            <Textarea id="draft_bl_description" value={formData.draft_bl_description || ''} onChange={e => handleInputChange('draft_bl_description', e.target.value)} placeholder="Descrição detalhada da mercadoria" />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="fito">
                                 <div className="p-4 border rounded-lg space-y-4 mt-4">
                                     <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="draft_fito_consignee">To consignee</Label>
                                            <Textarea id="draft_fito_consignee" value={formData.draft_fito_consignee || ''} onChange={e => handleInputChange('draft_fito_consignee', e.target.value)} placeholder="Nome e endereço do consignatário" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="draft_fito_description">Description of Goods</Label>
                                            <Textarea id="draft_fito_description" value={formData.draft_fito_description || ''} onChange={e => handleInputChange('draft_fito_description', e.target.value)} placeholder="Descrição da mercadoria" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="draft_fito_treatment">Treatment</Label>
                                            <Input id="draft_fito_treatment" value={formData.draft_fito_treatment || ''} onChange={e => handleInputChange('draft_fito_treatment', e.target.value)} placeholder="Ex: PHOSPHINE" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="draft_fito_date">Date</Label>
                                            <Input id="draft_fito_date" value={formData.draft_fito_date || ''} onChange={e => handleInputChange('draft_fito_date', e.target.value)} placeholder="DD/MM/YYYY to DD/MM/YYYY" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="draft_fito_concentration">Concentration</Label>
                                            <Input id="draft_fito_concentration" value={formData.draft_fito_concentration || ''} onChange={e => handleInputChange('draft_fito_concentration', e.target.value)} placeholder="Ex: 2G/M3 - 120H" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="draft_fito_chemical">Declared name and concentration</Label>
                                            <Input id="draft_fito_chemical" value={formData.draft_fito_chemical || ''} onChange={e => handleInputChange('draft_fito_chemical', e.target.value)} placeholder="Ex: CALCIUM PHOSPHIDE 98%" />
                                        </div>
                                    </div>
                                 </div>
                            </TabsContent>
                            <TabsContent value="co">
                                <div className="p-4 border rounded-lg space-y-4 mt-4">
                                     <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="draft_co_consignee">Consigned to</Label>
                                            <Textarea id="draft_co_consignee" value={formData.draft_co_consignee || ''} onChange={e => handleInputChange('draft_co_consignee', e.target.value)} placeholder="Nome e endereço do consignatário" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="draft_co_description">Description of Goods</Label>
                                            <Textarea id="draft_co_description" value={formData.draft_co_description || ''} onChange={e => handleInputChange('draft_co_description', e.target.value)} placeholder="Descrição da mercadoria" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="draft_co_hs_code">HS Code</Label>
                                            <Input id="draft_co_hs_code" value={formData.draft_co_hs_code || ''} onChange={e => handleInputChange('draft_co_hs_code', e.target.value)} placeholder="NCM do produto" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="draft_co_invoice">Invoice No.</Label>
                                            <Input id="draft_co_invoice" value={formData.draft_co_invoice || ''} onChange={e => handleInputChange('draft_co_invoice', e.target.value)} placeholder="Número da Invoice" />
                                        </div>
                                    </div>
                                 </div>
                            </TabsContent>
                        </Tabs>

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
                            <Button type="button" variant="outline" size="sm" onClick={addNotaFiscal}>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Adicionar Nota Fiscal
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {formData.notas_fiscais.map((nota: any, index: number) => (
                              <div key={nota.id} className="grid md:grid-cols-3 gap-2 items-end p-2 border rounded-md">
                                <div className="space-y-2">
                                  <Label htmlFor={`nf-tipo-${index}`}>Tipo</Label>
                                  <Select value={nota.tipo} onValueChange={(value) => handleNotaFiscalChange(index, 'tipo', value)}>
                                    <SelectTrigger id={`nf-tipo-${index}`}>
                                      <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Remessa">Remessa</SelectItem>
                                      <SelectItem value="Retorno">NF do Produtor</SelectItem>
                                      <SelectItem value="Exportação">Exportação</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`nf-chave-${index}`}>Chave de Acesso</Label>
                                  <Input id={`nf-chave-${index}`} value={nota.chave || ''} onChange={(e) => handleNotaFiscalChange(index, 'chave', e.target.value)} placeholder="Insira a chave da NF..." />
                                </div>
                                <div className="flex items-center gap-2">
                                    {nota.file ? (
                                        <div className="flex items-center gap-1">
                                            <a href={nota.file.url} target="_blank" rel="noopener noreferrer">
                                                <Button variant="outline" size="icon" type="button" title={nota.file.name}>
                                                    <Check className="h-4 w-4 text-green-600" />
                                                </Button>
                                            </a>
                                            <Button variant="ghost" size="icon" type="button" onClick={() => removeFile({ type: 'nota_fiscal', index })} className="text-destructive hover:text-destructive">
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button variant="outline" size="icon" type="button" title="Anexar XML/PDF" onClick={() => triggerFileUpload({ type: 'nota_fiscal', index })}>
                                            <FileUp className="h-4 w-4" />
                                        </Button>
                                    )}
                                  <Button type="button" variant="ghost" size="icon" onClick={() => removeNotaFiscal(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            ))}
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
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div className="space-y-2">
                                <Label htmlFor="due_numero">Nº da DUE</Label>
                                <Input id="due_numero" value={formData.due_numero || ''} onChange={e => handleInputChange('due_numero', e.target.value)} placeholder="Ex: 24BR0001234567" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="due_status">Status da DUE</Label>
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
                            </div>
                        </div>
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="lpco_protocolo">Protocolo LPCO</Label>
                                <Input id="lpco_protocolo" value={formData.lpco_protocolo || ''} onChange={e => handleInputChange('lpco_protocolo', e.target.value)} placeholder="Ex: E2500273876" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mapa_status">Status da Inspeção MAPA (LPCO)</Label>
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
                                    <Label htmlFor="navio_final">Navio Final</Label>
                                    <Input id="navio_final" value={formData.navio_final || formData.navio || ''} onChange={e => handleInputChange('navio_final', e.target.value)} placeholder="Nome final do navio" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="viagem_final">Viagem Final</Label>
                                    <Input id="viagem_final" value={formData.viagem_final || formData.viagem || ''} onChange={e => handleInputChange('viagem_final', e.target.value)} placeholder="Viagem final" />
                                </div>
                            </div>
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
                        <h3 className="text-lg font-semibold">Etapa 5: Obtenção dos Documentos Originais</h3>
                        <p className='text-sm text-muted-foreground'>Gerencie a coleta e o envio dos documentos de pós-embarque.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="space-y-6 pt-6">
                         <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-medium">Dados dos Documentos (BL, Fito, etc.)</h3>
                                <Button type="button" variant="outline" size="sm" onClick={addBl}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Adicionar Documento
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Número</TableHead>
                                        <TableHead>Data Emissão</TableHead>
                                        <TableHead>Data Liberação</TableHead>
                                        <TableHead>Data Retirada</TableHead>
                                        <TableHead>Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {formData.bls.map((bl:any, index:number) => (
                                        <TableRow key={bl.id}>
                                            <TableCell>
                                                <Select value={bl.tipo || 'BL'} onValueChange={value => handleBlChange(index, 'tipo', value)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {documentTypes.map(type => (
                                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell><Input value={bl.numero || ''} onChange={e => handleBlChange(index, 'numero', e.target.value)} /></TableCell>
                                            <TableCell><DatePicker date={bl.data_emissao} onDateChange={date => handleBlChange(index, 'data_emissao', date)} /></TableCell>
                                            <TableCell><DatePicker date={bl.data_liberacao} onDateChange={date => handleBlChange(index, 'data_liberacao', date)}/></TableCell>
                                            <TableCell><DatePicker date={bl.data_retirada} onDateChange={date => handleBlChange(index, 'data_retirada', date)}/></TableCell>
                                            <TableCell>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeBl(index)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </div>
                        <div>
                            <h3 className="text-md font-medium mb-4">Checklist de Coleta</h3>
                            <div className="space-y-3">
                                {formData.documentos_originais.map((doc:any) => (
                                    <div key={doc.id} className={`flex items-center justify-between gap-4 ${doc.isSubtask ? 'pl-6' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <Checkbox
                                                id={doc.id}
                                                checked={doc.done}
                                                onCheckedChange={(checked) => handleOriginalDocChange(doc.id, !!checked)}
                                            />
                                            <Label htmlFor={doc.id} className="font-normal text-sm">{doc.name}</Label>
                                        </div>
                                        {doc.done && doc.completionDate && (
                                            <span className="text-xs text-muted-foreground">{doc.completionDate}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
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



    