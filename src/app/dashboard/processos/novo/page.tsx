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
import { ArrowLeft, CheckCircle, Upload, XCircle, PlusCircle, Trash2, FileDown, Loader2, FileUp, Download, Info, Save } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser, useStorage, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/xml",
  "text/xml",
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "application/octet-stream"
];

type FileData = {
  name: string;
  storagePath: string;
  downloadURL: string;
  type: string;
  size: number;
  uploadState?: 'running' | 'success' | 'error' | 'finalizing';
  uploadProgress?: number;
};

const processStatusOptions = [
  "NOMEAÇÃO RECEBIDA",
  "AGUARDANDO INSTRUÇÃO DOCUMENTARIA",
  "AGUARDANDO APROVAÇÃO DO DRAFT",
  "DRAFT APROVADOS",
  "DRAFT ENVIADOS AO AGENTE/ARMADOR",
  "AGUARDANDO DADOS DOS CONTAINERS",
  "AGUARDANDO NF REMESSAS",
  "AGUARDANDO NF EXPORTAÇÃO",
  "AGUARDANDO ENTREDA DOS CONTAINERS",
  "DUE REGISTRADA",
  "AGUARDANDO DESEMBARAÇO",
  "DUE DESEMABARAÇADA",
  "DUE AVERBADA",
  "LPCO REGISTRADO",
  "LPCO EM ANALISE",
  "LPCO EM EXIGENCIA / NFA",
  "AGUARDANDO INSPEÇÃO DO MAPA",
  "LIBERADO PARA EMBARQUE",
  "PROCESSO EMBARCADO",
  "PROCESSO EMBARCADO (QUEBRA DE LOTE)",
  "AGUARDANDO LIBERAÇÃO DO BL",
  "AGUARDANDO LIBERAÇÃO/CERTIFICADO ORIGEM",
  "AGUARDANDO LIBERAÇÃO/CERTIFICADO FITO",
  "AGUARDANDO LIBERAÇÃO/CERTIFICADO FUMIGAÇÃO",
  "AGUARDANDO LIBERAÇÃO/CERTIFICADO SUPERVISORA",
  "AGUARDANDO LIBERAÇÃO/CERTIFICADO NON-GMO(MAPA)",
  "AGUARDANDO ENDEREÇO PARA ENVIO DOS DOCTOS",
  "SET DOC ENVIADOS (DHL)",
  "SET DOC ENVIADOS (PIERDOC)",
  "Concluído",
  "Cancelado",
];

const dueStatusOptions = [
  "RASCUNHO SALVO",
  "REGISTRADA",
  "AGUARDANDO ENTREGA DO CARGA/PARAMETRIZAÇÃO",
  "DESEMABRAÇADA",
  "SELECIONADA/CANAL LARANJA",
  "SELECIONADA/CANAL VERMELHO",
  "DESEMBARAÇADA",
  "RETIFICAÇÃO",
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

const treatmentStatusOptions = [
  "SOLICITADO",
  "AGENDADO",
  "REALIZADO",
  "CERTIFICADO EMITIDO",
  "CANCELADO"
];

const treatmentTypeOptions = [
  "BROMETO OFICIAL",
  "FOSFINA OFICIAL",
  "FOSFINA NÃO OFICIAL"
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

const fiscalDocTypes = [
  "DUE",
  "LPCO",
  "TRATAMENTO"
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
  terminalDescargaNome: '',
  terminalDespachoNome: '',
  terminalEmbarqueNome: '',
  destino: '',
  status: 'NOMEAÇÃO RECEBIDA',
  booking_number: '',
  armadorId: '',
  armadorNome: '',
  navio: '',
  viagem: '',
  containers: [] as any[],
  documentos_pos_embarque: [] as { id: string | number; nome: string; originais: number; copias: number; data_emissao: string | null; data_liberacao: string | null; file: FileData | null }[],
  notas_fiscais: [] as { id: string | number; tipo: string; chave: string; data_pedido: string | null; data_recebida: string | null; file: FileData | null }[],
  documentos_fiscais: [] as { id: string | number; tipo: string; identificacao: string; status: string; data: string | null; file: FileData | null }[],
  due_numero: '',
  due_status: 'RASCUNHO SALVO',
  due_file: null as FileData | null,
  lpco_protocolo: '',
  mapa_status: 'RASCUNHO SALVO',
  lpco_file: null as FileData | null,
  navio_final: '',
  awb_courier: '',
  analistaId: '',
  analistaNome: '',
  draft_bl_file: null as FileData | null,
  draft_fito_file: null as FileData | null,
  draft_co_file: null as FileData | null,
  deadline_draft: null as string | null,
  deadline_vgm: null as string | null,
  deadline_carga: null as string | null,
  etd: null as string | null,
  eta: null as string | null,
  deadline_draft_file: null as FileData | null,
  deadline_vgm_file: null as FileData | null,
  deadline_carga_file: null as FileData | null,
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

function sanitizeFileName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '');
}

export default function NovoProcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = useStorage();
  const { user: currentUser } = useUser();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerFileInputRef = useRef<HTMLInputElement>(null);
  const nfFileInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);
  
  const [uploadTarget, setUploadTarget] = useState<string | { type: 'nota_fiscal', id: string | number } | { type: 'documento_pos_embarque', id: string | number } | { type: 'documento_fiscal', id: string | number } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgresses, setUploadProgresses] = useState<Record<string, number>>({});

  const isEditing = searchParams.has('edit');
  const processId = searchParams.get('id');

  const pageProcessId = useMemo(() => {
    if (processId) return processId;
    if (!firestore) return null;
    return doc(collection(firestore, 'processos')).id;
  }, [processId, firestore]);

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

  const sortedPorts = useMemo(() => {
    if (!portos) return [];
    return [...portos].sort((a, b) => a.name.localeCompare(b.name));
  }, [portos]);

  const portOptions = useMemo(() => {
    if (!sortedPorts) return [];
    return sortedPorts.map(port => ({ value: port.id, label: `${port.name} - ${port.country}` }));
  }, [sortedPorts]);

  const [filteredTerminais, setFilteredTerminais] = useState<any[]>([]);

  const isUploading = useMemo(() => {
    return Object.values(uploadProgresses).some(p => p > 0 && p < 100);
  }, [uploadProgresses]);

  useEffect(() => {
    if (isEditing && processoData && parceiros && terminais && !hasInitialized.current) {
      const selectedExporter = parceiros?.find(p => p.id === processoData.exportadorId);
      const newContacts = selectedExporter?.contatos?.filter((c: any) => c.nome).map((c, index) => ({ ...c, id: String(index) })) || [];
      setExporterContacts(newContacts);

      setFormData({
        ...initialFormData,
        ...processoData,
        status: processoData.status || 'NOMEAÇÃO RECEBIDA',
        data_nomeacao: processoData.data_nomeacao || null,
        deadline_draft: processoData.deadline_draft,
        deadline_vgm: processoData.deadline_vgm,
        deadline_carga: processoData.deadline_carga,
        etd: processoData.etd,
        eta: processoData.eta,
        containers: processoData.containers || [],
        documentos_pos_embarque: processoData.documentos_pos_embarque || [],
        notas_fiscais: processoData.notas_fiscais || [],
        documentos_fiscais: processoData.documentos_fiscais || [],
        analistaId: String(processoData.analistaId || ''),
        analistaNome: String(processoData.analistaNome || ''),
        portoEmbarqueId: String(processoData.portoEmbarqueId || ''),
        portoDescargaId: String(processoData.portoDescargaId || ''),
        armadorId: String(processoData.armadorId || ''),
        armadorNome: String(processoData.armadorNome || ''),
      });

      if (processoData.portoEmbarqueId) {
        const filtered = terminais.filter((t: any) => String(t.portoId) === String(processoData.portoEmbarqueId));
        setFilteredTerminais(filtered);
      }
      
      hasInitialized.current = true;
    }
  }, [isEditing, processoData, terminais, parceiros]);

  useEffect(() => {
    if (formData.exportadorId && parceiros) {
      const selectedExporter = parceiros.find(p => p.id === formData.exportadorId);
      const newContacts = selectedExporter?.contatos?.filter((c: any) => c.nome).map((c: any, index: number) => ({ ...c, id: String(index) })) || [];
      setExporterContacts(newContacts);
    } else if (!formData.exportadorId) {
      setExporterContacts([]);
    }
  }, [formData.exportadorId, parceiros]);

  const isLoading = isLoadingProcesso || isLoadingParceiros || isLoadingProdutos || isLoadingPorts || isLoadingTerminais;

  const pageTitle = isEditing ? `Editar Processo ${formData.processo_interno || ''}` : 'Novo Processo (Nomeação)';
  const pageDescription = isEditing
    ? 'Gerencie todas as etapas do processo de exportação.'
    : 'Inicie um novo processo a partir de uma nomeação.';

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value ?? '' }));
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

  const handleDownload = async (file: FileData) => {
    if (!file) {
        toast({ title: "Erro", description: "Ficheiro não encontrado.", variant: "destructive" });
        return;
    }

    const currentProgress = uploadProgresses[file.storagePath] ?? (file.uploadState === 'success' ? 100 : 0);
    if (currentProgress > 0 && currentProgress < 100) {
        toast({ title: "Aguarde", description: "O ficheiro ainda está a ser carregado para o servidor.", variant: "default"});
        return;
    }

    let urlToOpen = file.downloadURL;

    if (!urlToOpen && file.storagePath && storage) {
      try {
        const fileRef = ref(storage, file.storagePath);
        urlToOpen = await getDownloadURL(fileRef);
      } catch (error) {
        toast({ 
            title: "Erro de Download", 
            description: "Não foi possível obter o URL do ficheiro.", 
            variant: "destructive" 
        });
        return;
      }
    }

    if (!urlToOpen) {
      toast({ title: "Erro", description: "URL do ficheiro não encontrada.", variant: "destructive" });
      return;
    }
    
    window.open(urlToOpen, '_blank');
  };

  const validarArquivo = (file: File) => {
    const isExtensionOk = file.name.toLowerCase().endsWith('.pdf') || 
                          file.name.toLowerCase().endsWith('.xml') ||
                          file.name.toLowerCase().endsWith('.png') ||
                          file.name.toLowerCase().endsWith('.jpg') ||
                          file.name.toLowerCase().endsWith('.jpeg');
    
    if (!ALLOWED_TYPES.includes(file.type) && !isExtensionOk) {
      throw new Error(`Tipo de ficheiro "${file.type || 'desconhecido'}" não permitido.`);
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`O ficheiro é demasiado grande. O limite é de ${MAX_FILE_SIZE_MB}MB.`);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const currentUploadTarget = uploadTarget;
      
      if (!file || !currentUploadTarget || !storage || !pageProcessId) {
          return;
      }

      try {
        validarArquivo(file);
      } catch (err: any) {
        toast({ title: "Arquivo Inválido", description: err.message, variant: "destructive" });
        return;
      }

      const targetField = typeof currentUploadTarget === 'string' ? currentUploadTarget : null;
      const targetList = typeof currentUploadTarget === 'object' ? (currentUploadTarget as any).type : null;
      const targetId = typeof currentUploadTarget === 'object' ? (currentUploadTarget as any).id : null;
      
      const safeName = sanitizeFileName(file.name);
      const fileNameInStorage = `${Date.now()}-${safeName}`;
      const filePath = `processos/${pageProcessId}/${fileNameInStorage}`;
      const storageRef = ref(storage, filePath);
      
      let explicitContentType = file.type;
      if (!explicitContentType) {
          if (file.name.toLowerCase().endsWith('.xml')) explicitContentType = 'application/xml';
          else if (file.name.toLowerCase().endsWith('.pdf')) explicitContentType = 'application/pdf';
          else explicitContentType = 'application/octet-stream';
      }
      
      const metadata = {
        contentType: explicitContentType,
        customMetadata: { processoId: pageProcessId, originalName: file.name, uploadedBy: currentUser?.uid || 'anonymous' }
      };

      const placeholder: FileData = {
          name: file.name,
          storagePath: filePath,
          downloadURL: '',
          type: explicitContentType,
          size: file.size,
          uploadState: 'running',
          uploadProgress: 1,
      };

      setFormData((prev: any) => {
          if (targetField) return { ...prev, [targetField]: placeholder };
          if (targetList === 'nota_fiscal') return { ...prev, notas_fiscais: prev.notas_fiscais.map((nf: any) => nf.id === targetId ? { ...nf, file: placeholder } : nf) };
          if (targetList === 'documento_pos_embarque') return { ...prev, documentos_pos_embarque: prev.documentos_pos_embarque.map((doc: any) => doc.id === targetId ? { ...doc, file: placeholder } : doc) };
          if (targetList === 'documento_fiscal') return { ...prev, documentos_fiscais: prev.documentos_fiscais.map((df: any) => df.id === targetId ? { ...df, file: placeholder } : df) };
          return prev;
      });

      setUploadProgresses(prev => ({ ...prev, [filePath]: 1 }));

      try {
          const uploadTask = uploadBytesResumable(storageRef, file, metadata);

          let lastProg = 0;
          uploadTask.on('state_changed',
              (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  if (Math.abs(progress - lastProg) < 5 && progress < 100) return;
                  lastProg = progress;
                  setUploadProgresses(prev => ({ ...prev, [filePath]: Math.max(1, progress) }));
              },
              (error: any) => {
                  setUploadProgresses(prev => {
                      const newState = { ...prev };
                      delete newState[filePath];
                      return newState;
                  });
                  toast({ title: "Falha no Upload", description: "Verifique sua conexão ou permissões de CORS.", variant: "destructive" });
              },
              async () => {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  const finalFileData: FileData = { ...placeholder, downloadURL, uploadState: 'success', uploadProgress: 100 };
                  
                  setUploadProgresses(prev => {
                      const newState = { ...prev };
                      delete newState[filePath];
                      return newState;
                  });

                  setFormData((prev: any) => {
                      let newState = { ...prev };
                      if (targetField) newState[targetField] = finalFileData;
                      else if (targetList === 'nota_fiscal') newState.notas_fiscais = prev.notas_fiscais.map((nf: any) => nf.id === targetId ? { ...nf, file: finalFileData } : nf);
                      else if (targetList === 'documento_pos_embarque') newState.documentos_pos_embarque = prev.documentos_pos_embarque.map((doc: any) => doc.id === targetId ? { ...doc, file: finalFileData } : doc);
                      else if (targetList === 'documento_fiscal') newState.documentos_fiscais = prev.documentos_fiscais.map((df: any) => df.id === targetId ? { ...df, file: finalFileData } : df);

                      if (pageProcessId && firestore) {
                          const procRef = doc(firestore, 'processos', pageProcessId);
                          const syncData: any = {};
                          if (targetField) syncData[targetField] = finalFileData;
                          else syncData[targetList === 'nota_fiscal' ? 'notas_fiscais' : targetList === 'documento_pos_embarque' ? 'documentos_pos_embarque' : 'documentos_fiscais'] = newState[targetList === 'nota_fiscal' ? 'notas_fiscais' : targetList === 'documento_pos_embarque' ? 'documentos_pos_embarque' : 'documentos_fiscais'];
                          updateDocumentNonBlocking(procRef, syncData);
                      }
                      return newState;
                  });
              }
          );
      } catch (err: any) {
          toast({ title: "Erro de Sistema", description: "Não foi possível iniciar o envio.", variant: "destructive" });
      }

      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadTarget(null);
  };

  const triggerFileUpload = (target: string | object) => {
    setUploadTarget(target as any);
    fileInputRef.current?.click();
  };

  const removeFile = (target: string | { type: string, id: string | number }) => {
    if (!storage || !firestore || !pageProcessId) return;

    let fileToRemove: FileData | null = null;
    let fieldToUpdate: string | null = null;
    let listToUpdate: any[] | null = null;
    
    if (typeof target === 'string') {
        fileToRemove = formData[target];
        fieldToUpdate = target;
        handleInputChange(target, null);
    } else if (typeof target === 'object' && target.type === 'nota_fiscal') {
        const nf = formData.notas_fiscais.find((n: any) => n.id === target.id);
        fileToRemove = nf?.file;
        const newNotas = formData.notas_fiscais.map((n: any) => n.id === target.id ? { ...n, file: null } : n);
        listToUpdate = newNotas;
        setFormData((prev: any) => ({ ...prev, notas_fiscais: newNotas }));
    } else if (typeof target === 'object' && target.type === 'documento_pos_embarque') {
        const docItem = formData.documentos_pos_embarque.find((d: any) => d.id === target.id);
        fileToRemove = docItem?.file;
        const newDocs = formData.documentos_pos_embarque.map((d: any) => d.id === target.id ? { ...d, file: null } : d);
        listToUpdate = newDocs;
        setFormData((prev: any) => ({ ...prev, documentos_pos_embarque: newDocs }));
    } else if (typeof target === 'object' && target.type === 'documento_fiscal') {
        const dfItem = formData.documentos_fiscais.find((df: any) => df.id === target.id);
        fileToRemove = dfItem?.file;
        const newFiscal = formData.documentos_fiscais.map((df: any) => df.id === target.id ? { ...df, file: null } : df);
        listToUpdate = newFiscal;
        setFormData((prev: any) => ({ ...prev, documentos_fiscais: newFiscal }));
    }
    
    const processoRef = doc(firestore, 'processos', pageProcessId);
    if (fieldToUpdate) updateDocumentNonBlocking(processoRef, { [fieldToUpdate]: null });
    else if (listToUpdate) {
        const fn = (target as any).type === 'nota_fiscal' ? 'notas_fiscais' : (target as any).type === 'documento_pos_embarque' ? 'documentos_pos_embarque' : 'documentos_fiscais';
        updateDocumentNonBlocking(processoRef, { [fn]: listToUpdate });
    }

    if (fileToRemove && fileToRemove.storagePath) {
        deleteObject(ref(storage, fileToRemove.storagePath)).catch(() => {});
    }
  };

  const handlePortChange = (value: string) => {
    handleInputChange('portoEmbarqueId', value);
    if (terminais) setFilteredTerminais(terminais.filter((t: any) => String(t.portoId) === value));
  };

  const handleContainerChange = (index: number, field: string, value: string | boolean) => {
    const updated = [...formData.containers];
    (updated[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, containers: updated }));
  };

  const handlePostShipmentDocChange = (id: string | number, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      documentos_pos_embarque: prev.documentos_pos_embarque.map((d: any) => d.id === id ? { ...d, [field]: value } : d)
    }));
  };

  const addPostShipmentDoc = () => {
    setFormData(prev => ({
      ...prev,
      documentos_pos_embarque: [...prev.documentos_pos_embarque, { id: Date.now(), nome: '', originais: 1, copias: 1, data_emissao: null, data_liberacao: null, file: null }]
    }));
  };

  const removePostShipmentDoc = (id: string | number) => {
    const docToRemove = formData.documentos_pos_embarque.find((d: any) => d.id === id);
    if (docToRemove?.file) removeFile({ type: 'documento_pos_embarque', id });
    setFormData(prev => ({ ...prev, documentos_pos_embarque: prev.documentos_pos_embarque.filter((d: any) => d.id !== id) }));
  };

  const handleFiscalDocChange = (id: string | number, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      documentos_fiscais: prev.documentos_fiscais.map((df: any) => {
        if (df.id === id) {
          const updated = { ...df, [field]: value };
          if (field === 'tipo') {
            if (value === 'DUE' || value === 'LPCO') updated.status = 'RASCUNHO SALVO';
            else if (value === 'TRATAMENTO') { updated.status = 'SOLICITADO'; updated.identificacao = 'BROMETO OFICIAL'; }
          }
          return updated;
        }
        return df;
      })
    }));
  };

  const addFiscalDoc = () => setFormData(prev => ({ ...prev, documentos_fiscais: [...(prev.documentos_fiscais || []), { id: Date.now(), tipo: 'DUE', identificacao: '', status: 'RASCUNHO SALVO', data: null, file: null }] }));

  const removeFiscalDoc = (id: string | number) => {
    const docToRemove = formData.documentos_fiscais.find((df: any) => df.id === id);
    if (docToRemove?.file) removeFile({ type: 'documento_fiscal', id });
    setFormData(prev => ({ ...prev, documentos_fiscais: prev.documentos_fiscais.filter((df: any) => df.id !== id) }));
  };

  const handleNotaFiscalChange = (id: string | number, field: string, value: any) => setFormData((prev: any) => ({ ...prev, notas_fiscais: prev.notas_fiscais.map((nf: any) => nf.id === id ? { ...nf, [field]: value } : nf) }));
  
  const handleMultipleNFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles || selectedFiles.length === 0 || !storage || !pageProcessId) return;

      const newEntries = Array.from(selectedFiles).map((file, i) => {
        try {
          validarArquivo(file);
          const sp = `processos/${pageProcessId}/${Date.now()}-${i}-${sanitizeFileName(file.name)}`;
          return {
            id: `${Date.now()}-${i}-${Math.random()}`, tipo: 'Remessa', chave: '', data_pedido: null, data_recebida: null,
            file: { name: file.name, storagePath: sp, downloadURL: '', type: file.type || 'application/pdf', size: file.size, uploadState: 'running' as const, uploadProgress: 1 },
            fileObj: file
          };
        } catch (err: any) {
          toast({ title: "Erro", description: `${file.name}: ${err.message}`, variant: "destructive" });
          return null;
        }
      }).filter(n => n !== null);

      if (newEntries.length === 0) return;

      setFormData((prev: any) => ({ ...prev, notas_fiscais: [...prev.notas_fiscais, ...newEntries.map(({fileObj, ...rest}: any) => rest)] }));

      newEntries.forEach((entry: any) => {
        const file = entry.fileObj;
        const uploadTask = uploadBytesResumable(ref(storage!, entry.file.storagePath), file, { contentType: entry.file.type });
        setUploadProgresses(prev => ({ ...prev, [entry.file.storagePath]: 1 }));

        uploadTask.on('state_changed',
          (snapshot) => setUploadProgresses(prev => ({ ...prev, [entry.file.storagePath]: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 })),
          () => { setUploadProgresses(prev => { const s = {...prev}; delete s[entry.file.storagePath]; return s; }); },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadProgresses(prev => { const s = {...prev}; delete s[entry.file.storagePath]; return s; });
            setFormData((prev: any) => {
                const list = prev.notas_fiscais.map((nf: any) => nf.id === entry.id ? { ...nf, file: { ...nf.file, downloadURL, uploadState: 'success', uploadProgress: 100 } } : nf);
                if (pageProcessId && firestore) updateDocumentNonBlocking(doc(firestore, 'processos', pageProcessId), { notas_fiscais: list });
                return { ...prev, notas_fiscais: list };
            });
          }
        );
      });
      if (nfFileInputRef.current) nfFileInputRef.current.value = '';
  };

  const generateOriginalDocsPdf = async () => {
    const { default: jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    const docPdf = new jsPDF();
    docPdf.text('PACOTE DE DOCUMENTOS DE EMBARQUE', 105, 40, { align: 'center' });
    (docPdf as any).autoTable({
      startY: 90,
      head: [['Documento', 'Qtd. Originais', 'Qtd. Cópias', 'Data Liberação']],
      body: formData.documentos_pos_embarque.map((d: any) => [d.nome, d.originais || '0', d.copias || '0', d.data_liberacao ? new Date(d.data_liberacao).toLocaleDateString('pt-BR') : 'N/A']),
    });
    docPdf.save(`Malote_${formData.processo_interno || 'processo'}.pdf`);
  };

  const generateNFsPdf = async () => {
    const { default: jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    const docPdf = new jsPDF();
    docPdf.text('PACOTE DE NOTAS FISCAIS', 105, 40, { align: 'center' });
    (docPdf as any).autoTable({
      startY: 80,
      head: [['Tipo', 'Chave', 'Ficheiro', 'Data Recebida']],
      body: formData.notas_fiscais.map((nf: any) => [nf.tipo, nf.chave || 'N/A', nf.file ? nf.file.name : 'Nenhum', nf.data_recebida ? new Date(nf.data_recebida).toLocaleDateString('pt-BR') : 'N/A']),
    });
    docPdf.save(`NFs_${formData.processo_interno || 'processo'}.pdf`);
  };

  const handleContainerImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const XLSX = await import('xlsx');
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(new Uint8Array(e.target?.result as ArrayBuffer), { type: 'array' });
        const json: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        setFormData(prev => ({ ...prev, containers: [...prev.containers, ...json.map(row => ({ id: Date.now() + Math.random(), numero: String(row.numero || ''), lacre: String(row.lacre || ''), tare: String(row.tare || ''), qty_especie: String(row.qty_especie || ''), gross_weight: String(row.gross_weight || ''), net_weight: String(row.net_weight || ''), m3: String(row.m3 || ''), vgm: String(row.vgm || ''), inspecionado: false, novo_lacre: '' }))] }));
        toast({ title: 'Sucesso', description: `${json.length} contêineres importados.` });
      } catch { toast({ title: 'Erro', description: 'Falha ao ler planilha.', variant: 'destructive' }); }
      finally { setIsImporting(false); if (containerFileInputRef.current) containerFileInputRef.current.value = ''; }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet([{ numero: "MSCU1234567", lacre: "SEAL123", tare: "2200", qty_especie: "540", gross_weight: "27000", net_weight: "24800", m3: "33", vgm: "27000" }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Containers");
    XLSX.writeFile(wb, "template_containers.xlsx");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) { toast({ title: 'Aguarde', description: 'Ficheiros ainda em carregamento.' }); return; }
    if (!firestore || !pageProcessId) return;
    setIsSaving(true);
    try {
      await setDoc(doc(firestore, 'processos', pageProcessId), { ...formData, id: pageProcessId }, { merge: true });
      toast({ title: "Sucesso!", description: "Processo salvo." });
      router.push('/dashboard/processos');
    } catch { toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" }); }
    finally { setIsSaving(false); }
  };

  const renderFileState = (file: FileData | null) => {
    if (!file) return <span className="text-muted-foreground italic">Nenhum ficheiro anexado.</span>;
    const prog = uploadProgresses[file.storagePath] ?? (file.uploadState === 'success' ? 100 : 0);
    if (prog > 0 && prog < 100) return (
        <div className="flex flex-col gap-1 w-full py-1">
          <div className="flex justify-between text-[10px] font-medium"><span>A carregar...</span><span>{Math.round(prog)}%</span></div>
          <Progress value={prog} className="h-1.5" />
        </div>
    );
    if (file.uploadState === 'success' || prog === 100) return <div className="flex items-center gap-2 overflow-hidden w-full"><CheckCircle className="h-3 w-3 text-green-500 shrink-0" /><span className="truncate text-xs flex-1">{file.name}</span></div>;
    return <span className="text-muted-foreground italic">Erro no upload.</span>;
  };

  if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-start">
          <div className='flex items-center gap-4'>
            <Link href="/dashboard/processos"><Button variant="outline" size="icon" type="button"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
              <div className='mt-2'>
                <Select value={formData.status || 'NOMEAÇÃO RECEBIDA'} onValueChange={value => handleInputChange('status', value)}>
                  <SelectTrigger className="w-[350px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>{processStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex gap-2"><Button variant="outline" type="button" onClick={() => router.push('/dashboard/processos')}>Cancelar</Button><Button type="submit" disabled={isSaving || isUploading}>{isSaving ? 'A guardar...' : 'Salvar'}</Button></div>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xml,.pdf,image/*" />
        <input type="file" ref={containerFileInputRef} onChange={handleContainerImport} className="hidden" accept=".xlsx, .xls" />
        <input type="file" ref={nfFileInputRef} onChange={handleMultipleNFUpload} className="hidden" accept=".xml,.pdf,image/*" multiple />

        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger><div className='flex items-center gap-3'>{getStepStatusIcon(1)}<h3 className="text-lg font-semibold">Etapa 1: Dados do Processo</h3></div></AccordionTrigger>
            <AccordionContent>
              <Card><CardContent className="grid gap-6 pt-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Processo Interno</Label><Input value={formData.processo_interno || ''} onChange={e => handleInputChange('processo_interno', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Contrato/PO</Label><Input value={formData.po_number || ''} onChange={e => handleInputChange('po_number', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Data Nomeação</Label><DatePicker date={formData.data_nomeacao} onDateChange={d => handleInputChange('data_nomeacao', d)} /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Exportador</Label><Combobox items={parceiros?.filter(p => p.tipo_parceiro === 'Exportador').map(p => ({ value: p.id, label: p.nome_fantasia || p.razao_social })) || []} value={formData.exportadorId} onValueChange={v => handleInputChange('exportadorId', v)} /></div>
                  <div className="space-y-2"><Label>Contato</Label><Combobox items={exporterContacts.map(c => ({ value: String(c.id), label: c.nome }))} value={String(formData.analistaId || '')} onValueChange={id => { const c = exporterContacts.find(x => String(x.id) === id); handleInputChange('analistaId', id); handleInputChange('analistaNome', c?.nome || ''); }} disabled={!formData.exportadorId} creatable onCreate={handleCreateContact} /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Produto</Label><Input value={formData.produtoNome || ''} onChange={e => handleInputChange('produtoNome', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Quantidade</Label><Input value={formData.quantidade || ''} onChange={handleQuantityChange} /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Booking</Label><Input value={formData.booking_number || ''} onChange={e => handleInputChange('booking_number', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Agente/Armador</Label><Combobox items={parceiros?.filter(p => p.tipo_parceiro === 'Armador').map(p => ({ value: p.id, label: p.nome_fantasia })) || []} value={formData.armadorId} onValueChange={v => handleInputChange('armadorId', v)} creatable onCreate={handleCreatePartner} /></div>
                </div>
              </CardContent></Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" disabled={!isEditing}>
            <AccordionTrigger><div className='flex items-center gap-3'>{getStepStatusIcon(2)}<h3 className="text-lg font-semibold">Etapa 2: Drafts</h3></div></AccordionTrigger>
            <AccordionContent>
              <Card><CardContent className='space-y-6 pt-6'>
                {['draft_bl_file', 'draft_fito_file', 'draft_co_file'].map(f => (
                  <div key={f} className="space-y-2">
                    <Label>{f.replace('draft_', '').replace('_file', '').toUpperCase()}</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-2 border rounded-md text-sm bg-muted overflow-hidden">{renderFileState(formData[f])}</div>
                      {formData[f] ? <div className="flex gap-1"><Button variant="outline" size="icon" onClick={() => handleDownload(formData[f])}><Download className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => removeFile(f)}><XCircle className="h-4 w-4" /></Button></div> : <Button variant="outline" size="icon" onClick={() => triggerFileUpload(f)}><Upload className="h-4 w-4" /></Button>}
                    </div>
                  </div>
                ))}
              </CardContent></Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" disabled={!isEditing}>
            <AccordionTrigger><div className='flex items-center gap-3'>{getStepStatusIcon(3)}<h3 className="text-lg font-semibold">Etapa 3: Fiscal e Inspeção</h3></div></AccordionTrigger>
            <AccordionContent>
              <Card><CardContent className="space-y-6 pt-6">
                <div className="flex justify-between items-center"><h3 className="font-medium">Documentos Fiscais</h3><Button variant="outline" size="sm" onClick={addFiscalDoc}><PlusCircle className="mr-2 h-4 w-4" />Adicionar</Button></div>
                <Table><TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Identificação</TableHead><TableHead>Status</TableHead><TableHead>Anexo</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>{formData.documentos_fiscais?.map((df: any) => (
                  <TableRow key={df.id}>
                    <TableCell><Select value={df.tipo} onValueChange={v => handleFiscalDocChange(df.id, 'tipo', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{fiscalDocTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></TableCell>
                    <TableCell><Input value={df.identificacao} onChange={e => handleFiscalDocChange(df.id, 'identificacao', e.target.value)} /></TableCell>
                    <TableCell><Select value={df.status} onValueChange={v => handleFiscalDocChange(df.id, 'status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{df.tipo === 'DUE' ? dueStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>) : lpcoStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></TableCell>
                    <TableCell><div className="flex items-center gap-2"><div className="flex-1 p-2 border rounded-md text-[10px] bg-muted overflow-hidden">{renderFileState(df.file)}</div>{df.file ? <Button variant="ghost" size="icon" onClick={() => removeFiscalDoc(df.id)}><XCircle className="h-3 w-3" /></Button> : <Button variant="outline" size="icon" onClick={() => triggerFileUpload({ type: 'documento_fiscal', id: df.id })}><Upload className="h-3 w-3" /></Button>}</div></TableCell>
                    <TableCell><Button variant="ghost" size="icon" onClick={() => removeFiscalDoc(df.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                  </TableRow>
                ))}</TableBody></Table>
              </CardContent></Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </div>
  );
}