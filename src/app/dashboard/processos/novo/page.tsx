
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser, useStorage, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Combobox } from '@/components/ui/combobox';
import * as XLSX from 'xlsx';
import { Progress } from '@/components/ui/progress';

// Configurações de Validação de Ficheiros
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

/**
 * Sanitiza o nome do arquivo removendo acentos, espaços e caracteres especiais.
 */
function sanitizeFileName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, '_') // Troca espaços por underscore
    .replace(/[^a-zA-Z0-9._-]/g, ''); // Remove caracteres não permitidos
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
        
        setFormData((prev: any) => {
            const updateItemFile = (item: any) => {
                if (item && item.file && item.file.storagePath === file.storagePath) {
                    return { ...item, file: { ...item.file, downloadURL: urlToOpen } };
                }
                return item;
            };

            const updatedNotas = prev.notas_fiscais.map(updateItemFile);
            const updatedDocs = prev.documentos_pos_embarque.map(updateItemFile);
            const updatedFiscal = prev.documentos_fiscais.map(updateItemFile);
            
            let updatedState = { 
              ...prev, 
              notas_fiscais: updatedNotas, 
              documentos_pos_embarque: updatedDocs,
              documentos_fiscais: updatedFiscal
            };
            
            Object.keys(updatedState).forEach(key => {
                const potentialFile = updatedState[key];
                if (potentialFile && typeof potentialFile === 'object' && potentialFile.storagePath === file.storagePath) {
                    updatedState[key] = { ...potentialFile, downloadURL: urlToOpen };
                }
            });

            return updatedState;
        });

      } catch (error) {
        toast({ 
            title: "Erro de Download", 
            description: "Não foi possível obter o URL do ficheiro. Verifique a sua ligação.", 
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
      throw new Error(`Tipo de ficheiro "${file.type || 'desconhecido'}" não permitido. Use PDF, XML ou Imagens.`);
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

      if (!currentUser) {
          toast({ title: "Erro de Autenticação", description: "Sessão expirada. Por favor, faça login novamente.", variant: "destructive" });
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
        customMetadata: {
          processoId: pageProcessId,
          originalName: file.name,
          uploadedBy: currentUser.uid
        }
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
          if (targetField) {
              return { ...prev, [targetField]: placeholder };
          } else if (targetList === 'nota_fiscal') {
              const newNotas = prev.notas_fiscais.map((nf: any) => nf.id === targetId ? { ...nf, file: placeholder } : nf);
              return { ...prev, notas_fiscais: newNotas };
          } else if (targetList === 'documento_pos_embarque') {
              const newDocs = prev.documentos_pos_embarque.map((doc: any) => doc.id === targetId ? { ...doc, file: placeholder } : doc);
              return { ...prev, documentos_pos_embarque: newDocs };
          } else if (targetList === 'documento_fiscal') {
              const newFiscal = prev.documentos_fiscais.map((df: any) => df.id === targetId ? { ...df, file: placeholder } : df);
              return { ...prev, documentos_fiscais: newFiscal };
          }
          return prev;
      });

      setUploadProgresses(prev => ({ ...prev, [filePath]: 1 }));

      try {
          const uploadTask = uploadBytesResumable(storageRef, file, metadata);

          let lastProgress = 0;
          uploadTask.on('state_changed',
              (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  // Throttle progress updates to avoid lag
                  if (Math.abs(progress - lastProgress) < 5 && progress < 100) return;
                  lastProgress = progress;
                  setUploadProgresses(prev => ({ ...prev, [filePath]: Math.max(1, progress) }));
              },
              (error: any) => {
                  setUploadProgresses(prev => {
                      const newState = { ...prev };
                      delete newState[filePath];
                      return newState;
                  });
                  setFormData((prev: any) => {
                      if (targetField) return { ...prev, [targetField]: null };
                      if (targetList === 'nota_fiscal') return { ...prev, notas_fiscais: prev.notas_fiscais.map((nf: any) => nf.id === targetId ? { ...nf, file: null } : nf) };
                      if (targetList === 'documento_pos_embarque') return { ...prev, documentos_pos_embarque: prev.documentos_pos_embarque.map((doc: any) => doc.id === targetId ? { ...doc, file: null } : doc) };
                      if (targetList === 'documento_fiscal') return { ...prev, documentos_fiscais: prev.documentos_fiscais.map((df: any) => df.id === targetId ? { ...df, file: null } : df) };
                      return prev;
                  });
                  toast({ title: "Falha no Upload", description: error.code, variant: "destructive" });
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
                      if (targetField) {
                          newState = { ...prev, [targetField]: finalFileData };
                      } else if (targetList === 'nota_fiscal') {
                          newState = { ...prev, notas_fiscais: prev.notas_fiscais.map((nf: any) => nf.id === targetId ? { ...nf, file: finalFileData } : nf) };
                      } else if (targetList === 'documento_pos_embarque') {
                          newState = { ...prev, documentos_pos_embarque: prev.documentos_pos_embarque.map((doc: any) => doc.id === targetId ? { ...doc, file: finalFileData } : doc) };
                      } else if (targetList === 'documento_fiscal') {
                          newState = { ...prev, documentos_fiscais: prev.documentos_fiscais.map((df: any) => df.id === targetId ? { ...df, file: finalFileData } : df) };
                      }

                      // Sincronização automática com Firestore
                      if (pageProcessId && firestore) {
                          const processoRef = doc(firestore, 'processos', pageProcessId);
                          const dataToSync: any = {};
                          if (targetField) {
                              dataToSync[targetField] = finalFileData;
                          } else if (targetList === 'nota_fiscal') {
                              dataToSync.notas_fiscais = newState.notas_fiscais;
                          } else if (targetList === 'documento_pos_embarque') {
                              dataToSync.documentos_pos_embarque = newState.documentos_pos_embarque;
                          } else if (targetList === 'documento_fiscal') {
                              dataToSync.documentos_fiscais = newState.documentos_fiscais;
                          }
                          
                          if (Object.keys(dataToSync).length > 0) {
                              updateDocumentNonBlocking(processoRef, dataToSync);
                          }
                      }

                      return newState;
                  });
              }
          );
      } catch (err: any) {
          toast({ title: "Erro de Sistema", description: "Não foi possível iniciar o envio do ficheiro.", variant: "destructive" });
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
    
    // Sincronização automática pós-remoção
    const processoRef = doc(firestore, 'processos', pageProcessId);
    if (fieldToUpdate) {
        updateDocumentNonBlocking(processoRef, { [fieldToUpdate]: null });
    } else if (listToUpdate) {
        const fieldName = (target as any).type === 'nota_fiscal' ? 'notas_fiscais' : 
                          (target as any).type === 'documento_pos_embarque' ? 'documentos_pos_embarque' : 
                          'documentos_fiscais';
        updateDocumentNonBlocking(processoRef, { [fieldName]: listToUpdate });
    }

    if (fileToRemove && fileToRemove.storagePath) {
        const fileRef = ref(storage, fileToRemove.storagePath);
        deleteObject(fileRef).catch(() => {});
    }
  };

  const handlePortChange = (value: string) => {
    handleInputChange('portoEmbarqueId', value);
    if (terminais) {
      const filtered = terminais.filter((t: any) => String(t.portoId) === value);
      setFilteredTerminais(filtered);
    }
  };

  const handleContainerChange = (index: number, field: string, value: string | boolean) => {
    const updatedContainers = [...formData.containers];
    (updatedContainers[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, containers: updatedContainers }));
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
    if (docToRemove && docToRemove.file) {
      removeFile({ type: 'documento_pos_embarque', id });
    }
    setFormData(prev => ({ ...prev, documentos_pos_embarque: prev.documentos_pos_embarque.filter((d: any) => d.id !== id) }));
  };

  const handleFiscalDocChange = (id: string | number, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      documentos_fiscais: prev.documentos_fiscais.map((df: any) => {
        if (df.id === id) {
          const updated = { ...df, [field]: value };
          // Reset status if type changes
          if (field === 'tipo') {
            if (value === 'DUE') updated.status = 'RASCUNHO SALVO';
            else if (value === 'LPCO') updated.status = 'RASCUNHO SALVO';
            else if (value === 'TRATAMENTO') {
              updated.status = 'SOLICITADO';
              updated.identificacao = 'BROMETO OFICIAL';
            }
          }
          return updated;
        }
        return df;
      })
    }));
  };

  const addFiscalDoc = () => {
    setFormData(prev => ({
      ...prev,
      documentos_fiscais: [...prev.documentos_fiscais, { id: Date.now(), tipo: 'DUE', identificacao: '', status: 'RASCUNHO SALVO', data: null, file: null }]
    }));
  };

  const removeFiscalDoc = (id: string | number) => {
    const docToRemove = formData.documentos_fiscais.find((df: any) => df.id === id);
    if (docToRemove && docToRemove.file) {
      removeFile({ type: 'documento_fiscal', id });
    }
    setFormData(prev => ({ ...prev, documentos_fiscais: prev.documentos_fiscais.filter((df: any) => df.id !== id) }));
  };

  const handleNotaFiscalChange = (id: string | number, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      notas_fiscais: prev.notas_fiscais.map((nf: any) => nf.id === id ? { ...nf, [field]: value } : nf)
    }));
  };
  
  const handleMultipleNFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles || selectedFiles.length === 0 || !storage || !pageProcessId) return;

      const filesArray = Array.from(selectedFiles);
      
      const newEntries = filesArray.map((file, i) => {
        try {
          validarArquivo(file);
          const safeName = sanitizeFileName(file.name);
          const fileNameInStorage = `${Date.now()}-${i}-${safeName}`;
          const filePath = `processos/${pageProcessId}/${fileNameInStorage}`;
          const contentType = file.type || (file.name.toLowerCase().endsWith('.xml') ? 'application/xml' : 'application/pdf');
          
          return {
            id: `${Date.now()}-${i}-${Math.random()}`,
            tipo: 'Remessa',
            chave: '',
            data_pedido: null,
            data_recebida: null,
            file: {
              name: file.name,
              storagePath: filePath,
              downloadURL: '',
              type: contentType,
              size: file.size,
              uploadState: 'running' as const,
              uploadProgress: 1,
            },
            fileObj: file
          };
        } catch (err: any) {
          toast({ title: "Arquivo Ignorado", description: `${file.name}: ${err.message}`, variant: "destructive" });
          return null;
        }
      }).filter(n => n !== null);

      if (newEntries.length === 0) return;

      setFormData((prev: any) => ({
        ...prev,
        notas_fiscais: [...prev.notas_fiscais, ...newEntries.map(({fileObj, ...rest}: any) => rest)]
      }));

      newEntries.forEach((entry: any) => {
        const file = entry.fileObj;
        const filePath = entry.file.storagePath;
        const storageRef = ref(storage!, filePath);
        
        const metadata = { 
          contentType: entry.file.type,
          customMetadata: {
            processoId: pageProcessId,
            originalName: file.name,
            uploadedBy: currentUser?.uid || 'anonymous'
          }
        };
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        setUploadProgresses(prev => ({ ...prev, [filePath]: 1 }));

        let lastProg = 0;
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (Math.abs(progress - lastProg) < 5 && progress < 100) return;
            lastProg = progress;
            setUploadProgresses(prev => ({ ...prev, [filePath]: progress }));
          },
          (error: any) => {
            setUploadProgresses(prev => {
                const newState = { ...prev };
                delete newState[filePath];
                return newState;
            });
            setFormData((prev: any) => ({
              ...prev,
              notas_fiscais: prev.notas_fiscais.filter((nf: any) => nf.id !== entry.id)
            }));
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadProgresses(prev => {
                const newState = { ...prev };
                delete newState[filePath];
                return newState;
            });
            setFormData((prev: any) => {
                const updatedList = prev.notas_fiscais.map((nf: any) => 
                    nf.id === entry.id ? { ...nf, file: { ...nf.file, downloadURL, uploadState: 'success', uploadProgress: 100 } } : nf
                );
                
                // Auto-sync NF list
                if (pageProcessId && firestore) {
                    const processoRef = doc(firestore, 'processos', pageProcessId);
                    updateDocumentNonBlocking(processoRef, { notas_fiscais: updatedList });
                }

                return { ...prev, notas_fiscais: updatedList };
            });
          }
        );
      });

      if (nfFileInputRef.current) nfFileInputRef.current.value = '';
  };

  const removeNotaFiscal = (id: string | number) => {
    const notaToRemove = formData.notas_fiscais.find((n: any) => n.id === id);
    if(notaToRemove && notaToRemove.file) {
        removeFile({ type: 'nota_fiscal', id });
    }
    setFormData(prev => ({ ...prev, notas_fiscais: prev.notas_fiscais.filter((n: any) => n.id !== id) }));
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
    const updatedContainers = formData.containers.filter((_: any, i: number) => i !== index);
    setFormData(prev => ({ ...prev, containers: updatedContainers }));
  };

  const getStepStatusIcon = (step: number) => {
    const { status, documentos_fiscais } = formData;

    if (!status) return <XCircle className="h-5 w-5 text-gray-400" />;

    const statusNumber = processStatusOptions.indexOf(status);

    if (statusNumber < 0) return <XCircle className="h-5 w-5 text-gray-400" />;

    switch (step) {
      case 1:
        if (statusNumber >= processStatusOptions.indexOf("NOMEAÇÃO RECEBIDA")) return <CheckCircle className="h-5 w-5 text-green-500" />;
        return <XCircle className="h-5 w-5 text-gray-400" />;
      case 2:
        {
          if (statusNumber >= processStatusOptions.indexOf("DRAFT APROVADOS")) return <CheckCircle className="h-5 w-5 text-green-500" />;
          if (statusNumber >= processStatusOptions.indexOf("AGUARDANDO APROVAÇÃO DO DRAFT")) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
          return <XCircle className="h-5 w-5 text-gray-400" />;
        }
      case 3:
        {
          const hasAverbada = documentos_fiscais?.some((df: any) => df.tipo === 'DUE' && df.status === 'AVERBADA');
          if (hasAverbada || statusNumber >= processStatusOptions.indexOf("DUE AVERBADA")) return <CheckCircle className="h-5 w-5 text-green-500" />;
          if (statusNumber >= processStatusOptions.indexOf("DUE REGISTRADA")) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
          return <XCircle className="h-5 w-5 text-gray-400" />;
        }
      case 4:
        if (statusNumber >= processStatusOptions.indexOf("PROCESSO EMBARCADO")) {
          return <CheckCircle className="h-5 w-5 text-green-500" />;
        }
        if (statusNumber >= processStatusOptions.indexOf("LIBERADO PARA EMBARQUE")) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
        return <XCircle className="h-5 w-5 text-gray-400" />;
      case 5:
        {
          if (statusNumber >= processStatusOptions.indexOf("SET DOC ENVIADOS (DHL)")) return <CheckCircle className="h-5 w-5 text-green-500" />;
          if (statusNumber >= processStatusOptions.indexOf("AGUARDANDO LIBERAÇÃO DO BL")) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
          return <XCircle className="h-5 w-5 text-gray-400" />;
        }
      case 6:
        if (status === "Concluído") return <CheckCircle className="h-5 w-5 text-green-500" />;
        if (statusNumber >= processStatusOptions.indexOf("SET DOC ENVIADOS (DHL)")) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
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
    setDoc(partnerRef, { contatos: updatedContacts }, { merge: true });

    const newContactId = String(updatedContacts.length - 1);
    const newContactsForState = updatedContacts.map((c, i) => ({ ...c, id: String(i) }));
    setExporterContacts(newContactsForState);

    const contact = newContactsForState.find(c => c.id === newContactId);
    setFormData(prev => ({
      ...prev,
      analistaId: newContactId,
      analistaNome: contact?.nome || contactName
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
    setDoc(partnerRef, { ...newPartnerData }, { merge: true });

    const fieldId = 'armadorId';
    setFormData(prev => ({
      ...prev,
      [fieldId]: newPartnerId,
      armadorNome: partnerName
    }));

    toast({
      title: "Armador Criado",
      description: `"${partnerName}" foi adicionado à base de dados de parceiros.`
    });
  };

  const handleCreateTerminal = (terminalName: string, tipo: 'Terminal de Embarque' | 'Terminal de Descarga') => {
    if (!firestore) return;

    const newPartnerId = doc(collection(firestore, 'partners')).id;
    const newPartnerData = {
      id: newPartnerId,
      nome_fantasia: terminalName,
      tipo_parceiro: tipo
    };

    const partnerRef = doc(firestore, 'partners', newPartnerId);
    setDoc(partnerRef, { ...newPartnerData }, { merge: true });

    const fieldId = tipo === 'Terminal de Embarque' ? 'terminalDespachoId' : 'terminalEmbarqueId';
    const fieldName = tipo === 'Terminal de Embarque' ? 'terminalDespachoNome' : 'terminalEmbarqueNome';
    setFormData(prev => ({
      ...prev,
      [fieldId]: newPartnerId,
      [fieldName]: terminalName
    }));

    toast({
      title: "Terminal Criado",
      description: `"${terminalName}" foi adicionado à base de dados de parceiros como ${tipo}.`
    });
  };

  const generateOriginalDocsPdf = async () => {
    const docPdf = new jsPDF();

    let originalsCount = formData.documentos_pos_embarque.reduce((acc: number, doc: any) => acc + (Number(doc.originais) || 0), 0);
    let copiesCount = formData.documentos_pos_embarque.reduce((acc: number, doc: any) => acc + (Number(doc.copias) || 0), 0);

    docPdf.setFontSize(22);
    docPdf.setFont('helvetica', 'bold');
    docPdf.text('PACOTE DE DOCUMENTOS DE EMBARQUE', 105, 40, { align: 'center' });

    docPdf.setFontSize(16);
    docPdf.text(`Processo: ${formData.processo_interno || 'N/A'}`, 105, 60, { align: 'center' });

    if (formData.awb_courier) {
      docPdf.setFontSize(14);
      docPdf.setFont('helvetica', 'normal');
      docPdf.text(`AWB do Courier: ${formData.awb_courier}`, 105, 70, { align: 'center' });
    }

    (docPdf as any).autoTable({
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

    (docPdf as any).autoTable({
      startY: (docPdf as any).lastAutoTable.finalY + 10,
      head: [['Documento', 'Qtd. Originais', 'Qtd. Cópias', 'Data Emissão', 'Data Liberação', 'Ficheiro Anexado']],
      body: formData.documentos_pos_embarque
        .map((d: any) => [
          d.nome,
          d.originais || '0',
          d.copias || '0',
          d.data_emissao ? new Date(d.data_emissao).toLocaleDateString('pt-BR') : 'N/A',
          d.data_liberacao ? new Date(d.data_liberacao).toLocaleDateString('pt-BR') : 'N/A',
          d.file ? d.file.name : 'Nenhum'
        ]),
      theme: 'striped',
      headStyles: { fillColor: [34, 107, 72] },
    });

    for (const docItem of formData.documentos_pos_embarque) {
        if (docItem.file && docItem.file.downloadURL && docItem.file.type.startsWith('image/')) {
            docPdf.addPage();
            docPdf.setFontSize(12);
            docPdf.text(`Anexo: ${docItem.nome} (${docItem.file.name})`, 14, 20);

            try {
                const response = await fetch(docItem.file.downloadURL);
                const blob = await response.blob();
                const dataUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                
                const format = docItem.file.type.split('/')[1]?.toUpperCase() || 'JPEG';
                docPdf.addImage(dataUrl, format, 15, 40, 180, 160, undefined, 'FAST');
            } catch (e) {
                docPdf.text(`Não foi possível pré-visualizar a imagem: ${docItem.file.name}`, 14, 40);
            }
        }
    }

    docPdf.save(`Malote_Documentos_${formData.processo_interno || 'processo'}.pdf`);
  };

  const generateNFsPdf = async () => {
    const docPdf = new jsPDF();

    docPdf.setFontSize(22);
    docPdf.setFont('helvetica', 'bold');
    docPdf.text('PACOTE DE NOTAS FISCAIS', 105, 40, { align: 'center' });

    docPdf.setFontSize(16);
    docPdf.text(`Processo: ${formData.processo_interno || 'N/A'}`, 105, 60, { align: 'center' });

    (docPdf as any).autoTable({
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
    
     for (const nf of formData.notas_fiscais) {
        if (nf.file && nf.file.downloadURL && nf.file.type.startsWith('image/')) {
            docPdf.addPage();
            docPdf.setFontSize(12);
            docPdf.text(`Anexo: ${nf.tipo} - ${nf.file.name}`, 14, 20);

            try {
                const response = await fetch(nf.file.downloadURL);
                const blob = await response.blob();
                const dataUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });

                const format = nf.file.type.split('/')[1]?.toUpperCase() || 'JPEG';
                docPdf.addImage(dataUrl, format, 15, 40, 180, 160, undefined, 'FAST');

            } catch (e) {
                docPdf.text(`Não foi possível pré-visualizar a imagem: ${nf.file.name}`, 14, 40);
            }
        }
    }


    docPdf.save(`Pacote_NFs_${formData.processo_interno || 'processo'}.pdf`);
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
        const workbookSheets = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(workbookSheets);

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

        setFormData(prev => ({ ...prev, containers: [...prev.containers, ...newContainers] }));

        toast({
          title: 'Importação Concluída',
          description: `${newContainers.length} contêineres foram importados com sucesso.`,
        });
      } catch (error) {
        toast({
          title: 'Erro na Importação',
          description: 'Houve um problema ao ler o ficheiro.',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
        toast({
            title: 'Aguarde o Carregamento',
            description: 'Aguarde os ficheiros terminarem de carregar para o servidor.',
            variant: 'default',
        });
        return;
    }
    if (!firestore || !pageProcessId) {
      toast({ title: "Erro", description: "Base de dados indisponível.", variant: "destructive" });
      return;
    }
  
    setIsSaving(true);
  
    try {
      const docId = pageProcessId;
  
      const selectedExporter = parceiros?.find(p => String(p.id) === String(formData.exportadorId));
      const selectedAnalista = exporterContacts.find(c => String(c.id) === String(formData.analistaId));
      const selectedPortoEmbarque = portos?.find(p => String(p.id) === String(formData.portoEmbarqueId));
      const selectedPortoDescarga = portos?.find(p => String(p.id) === String(formData.portoDescargaId));
      const selectedArmador = parceiros?.find(p => String(p.id) === String(formData.armadorId));
      const selectedTerminalEmbarque = parceiros?.find(p => String(p.id) === String(formData.terminalDespachoId));
      const selectedTerminalDescarga = parceiros?.find(p => String(p.id) === String(formData.terminalEmbarqueId));
  
      const dataToSave = {
        ...formData,
        id: docId,
        status: formData.status || processoData?.status || 'NOMEAÇÃO RECEBIDA',
        exportadorNome: selectedExporter?.nome_fantasia || selectedExporter?.razao_social || formData.exportadorNome || 'N/A',
        analistaNome: selectedAnalista?.nome || formData.analistaNome || 'N/A',
        portoEmbarqueNome: selectedPortoEmbarque?.name || formData.portoEmbarqueNome || 'N/A',
        portoDescargaNome: selectedPortoDescarga?.name || formData.portoDescargaNome || 'N/A',
        destino: selectedPortoDescarga?.name || formData.destino || 'N/A',
        armadorNome: selectedArmador?.nome_fantasia || selectedArmador?.razao_social || formData.armadorNome || 'N/A',
        terminalDespachoNome: selectedTerminalEmbarque?.nome_fantasia || selectedTerminalEmbarque?.razao_social || formData.terminalDespachoNome || 'N/A',
        terminalEmbarqueNome: selectedTerminalDescarga?.nome_fantasia || selectedTerminalDescarga?.razao_social || formData.terminalEmbarqueNome || 'N/A',
      };
      
      const processoRef = doc(firestore, 'processos', docId);
      await setDoc(processoRef, dataToSave, { merge: true });
  
      toast({
        title: "Sucesso!",
        description: `Processo salvo com sucesso.`,
      });
      router.push('/dashboard/processos');
  
    } catch (error: any) {
      toast({
        title: "Erro ao Guardar",
        description: "Não foi possível guardar o processo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderFileState = (file: FileData | null) => {
    if (!file) {
      return <span className="text-muted-foreground italic">Nenhum ficheiro anexado.</span>;
    }
    
    const currentProgress = uploadProgresses[file.storagePath] ?? (file.uploadState === 'success' ? 100 : 0);
    
    if (currentProgress > 0 && currentProgress < 100) {
      return (
        <div className="flex flex-col gap-1 w-full py-1">
          <div className="flex justify-between items-center text-[10px] text-primary font-medium uppercase tracking-wider">
            <span>A carregar...</span>
            <span className="font-mono">{Math.round(currentProgress)}%</span>
          </div>
          <Progress value={currentProgress} className="h-1.5 transition-all duration-300" />
          <span className="text-[11px] text-muted-foreground truncate max-w-full" title={file.name}>{file.name}</span>
        </div>
      );
    }

    if (currentProgress === 100 && file.uploadState !== 'success') {
      return (
        <div className="flex flex-col gap-1 w-full py-1">
          <div className="flex justify-between items-center text-[10px] text-primary font-medium uppercase tracking-wider">
            <span>A finalizar...</span>
            <Loader2 className="h-3 w-3 animate-spin" />
          </div>
          <Progress value={100} className="h-1.5" />
          <span className="text-[11px] text-muted-foreground truncate max-w-full" title={file.name}>{file.name}</span>
        </div>
      );
    }
    
    if (file.uploadState === 'success' || currentProgress === 100) {
        return (
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
            <span className="text-foreground truncate font-medium text-xs flex-1" title={file.name}>{file.name}</span>
            <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold shrink-0 bg-green-50 px-1 rounded border border-green-100">
                <Save className="h-2 w-2" />
                <span>DB</span>
            </div>
          </div>
        );
    }

    return <span className="text-muted-foreground italic">Erro no upload.</span>;
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
              <div className='mt-2'>
                <Select value={formData.status || 'NOMEAÇÃO RECEBIDA'} onValueChange={value => handleInputChange('status', value)}>
                  <SelectTrigger id="status" className="w-[350px] h-8 text-xs">
                    <div className='flex items-center gap-2'>
                      <span className={cn(
                        "h-2 w-2 rounded-full",
                        getStatusVariant(formData.status) === 'default' && 'bg-green-500',
                        getStatusVariant(formData.status) === 'secondary' && 'bg-yellow-500',
                        getStatusVariant(formData.status) === 'destructive' && 'bg-red-500',
                        getStatusVariant(formData.status) === 'outline' && 'bg-gray-400'
                      )}></span>
                      <SelectValue placeholder="Selecione o status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {processStatusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Link href="/dashboard/processos" passHref>
              <Button variant="outline" type="button">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={isSaving || isLoading || isUploading}>
              {(isSaving || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'A guardar...' : isUploading ? 'A carregar...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-3 rounded-md flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-semibold">Nota sobre Anexos:</p>
            <p>PDF, XML e Imagens até 10MB são aceitos. O envio é sincronizado automaticamente.</p>
          </div>
        </div>

        <input type="file" id="general-file-upload" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xml,.pdf,image/*" />
        <input
          type="file"
          id="container-import-upload"
          ref={containerFileInputRef}
          onChange={handleContainerImport}
          className="hidden"
          accept=".xlsx, .xls"
        />
        <input
          type="file"
          id="nf-multiple-upload"
          ref={nfFileInputRef}
          onChange={handleMultipleNFUpload}
          className="hidden"
          accept=".xml,.pdf,image/*"
          multiple
        />

        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
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
                        items={parceiros?.filter(p => p.tipo_parceiro === 'Exportador').sort((a, b) => (a.nome_fantasia || a.razao_social).localeCompare(b.nome_fantasia || b.razao_social)).map(p => ({ value: p.id, label: `${p.nome_fantasia || p.razao_social} | ${p.cnpj || 'N/A'}` })) || []}
                        value={formData.exportadorId}
                        onValueChange={(value) => {
                          handleInputChange('exportadorId', value);
                          handleInputChange('analistaId', '');
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
                      <Input id="booking_number" value={formData.booking_number || ''} onChange={e => {
                        const value = e.target.value;
                        handleInputChange('booking_number', value);
                      }} placeholder="Insira o número do booking" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="armadorId">Agente / Armador</Label>
                      <Combobox
                        items={parceiros?.filter(p => p.tipo_parceiro === 'Armador' || p.tipo_parceiro === 'Agente de Carga').map(p => ({ value: p.id, label: p.nome_fantasia || p.razao_social })) || []}
                        value={formData.armadorId}
                        onValueChange={(value) => {
                            handleInputChange('armadorId', value);
                            const selected = parceiros?.find(p => p.id === value);
                            if (selected) {
                                handleInputChange('armadorNome', selected.nome_fantasia || selected.razao_social);
                            }
                        }}
                        placeholder={isLoadingParceiros ? "Carregando..." : "Selecionar agente/armador.."}
                        searchPlaceholder="Buscar ou criar parceiro..."
                        noResultsText="Nenhum parceiro encontrado."
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
                      <Label htmlFor="terminalDespachoId">Terminal de Embarque</Label>
                      <Combobox
                        items={parceiros?.filter(p => p.tipo_parceiro === 'Terminal de Embarque' || p.tipo_parceiro === 'Terminal de Descarga').map(p => ({ value: p.id, label: p.nome_fantasia || p.razao_social })) || []}
                        value={formData.terminalDespachoId}
                        onValueChange={(value) => {
                            handleInputChange('terminalDespachoId', value);
                            const selected = parceiros?.find(p => p.id === value);
                            if (selected) {
                                handleInputChange('terminalDespachoNome', selected.nome_fantasia || selected.razao_social);
                            }
                        }}
                        placeholder={isLoadingParceiros ? "Carregando..." : "Selecione ou crie um terminal"}
                        searchPlaceholder="Buscar ou criar terminal..."
                        noResultsText="Nenhum terminal encontrado."
                        creatable
                        onCreate={(name) => handleCreateTerminal(name, 'Terminal de Embarque')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="terminalEmbarqueId">Terminal de Descarga</Label>
                      <Combobox
                        items={parceiros?.filter(p => p.tipo_parceiro === 'Terminal de Embarque' || p.tipo_parceiro === 'Terminal de Descarga').map(p => ({ value: p.id, label: p.nome_fantasia || p.razao_social })) || []}
                        value={formData.terminalEmbarqueId}
                        onValueChange={(value) => {
                            handleInputChange('terminalEmbarqueId', value);
                            const selected = parceiros?.find(p => p.id === value);
                            if (selected) {
                                handleInputChange('terminalEmbarqueNome', selected.nome_fantasia || selected.razao_social);
                            }
                        }}
                        placeholder={isLoadingParceiros ? "Carregando..." : "Selecione ou crie um terminal"}
                        searchPlaceholder="Buscar ou criar terminal..."
                        noResultsText="Nenhum terminal encontrado."
                        creatable
                        onCreate={(name) => handleCreateTerminal(name, 'Terminal de Descarga')}
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
                      <DatePicker date={formData.deadline_draft} onDateChange={date => handleInputChange('deadline_draft', date)} showTime />
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 p-2 min-h-10 border rounded-md text-sm bg-muted flex items-center overflow-hidden">
                          {renderFileState(formData.deadline_draft_file)}
                        </div>
                        {formData.deadline_draft_file ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <Button type="button" variant="outline" size="icon" onClick={() => handleDownload(formData.deadline_draft_file)} title={`Descarregar ${formData.deadline_draft_file.name}`} disabled={uploadProgresses[formData.deadline_draft_file.storagePath] > 0}>
                              <Download className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeFile('deadline_draft_file')} className="text-destructive hover:text-destructive" title="Remover anexo" disabled={uploadProgresses[formData.deadline_draft_file.storagePath] > 0}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="icon" type="button" title="Anexar Comprovante" onClick={() => triggerFileUpload('deadline_draft_file')} className="shrink-0">
                             <Upload className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline VGM</Label>
                      <DatePicker date={formData.deadline_vgm} onDateChange={date => handleInputChange('deadline_vgm', date)} showTime />
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 p-2 min-h-10 border rounded-md text-sm bg-muted flex items-center overflow-hidden">
                          {renderFileState(formData.deadline_vgm_file)}
                        </div>
                        {formData.deadline_vgm_file ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <Button type="button" variant="outline" size="icon" onClick={() => handleDownload(formData.deadline_vgm_file)} title={`Descarregar ${formData.deadline_vgm_file.name}`} disabled={uploadProgresses[formData.deadline_vgm_file.storagePath] > 0}>
                              <Download className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeFile('deadline_vgm_file')} className="text-destructive hover:text-destructive" title="Remover anexo" disabled={uploadProgresses[formData.deadline_vgm_file.storagePath] > 0}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="icon" type="button" title="Anexar Comprovante" onClick={() => triggerFileUpload('deadline_vgm_file')} className="shrink-0">
                             <Upload className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline Carga</Label>
                      <DatePicker date={formData.deadline_carga} onDateChange={date => handleInputChange('deadline_carga', date)} showTime />
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 p-2 min-h-10 border rounded-md text-sm bg-muted flex items-center overflow-hidden">
                          {renderFileState(formData.deadline_carga_file)}
                        </div>
                        {formData.deadline_carga_file ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <Button type="button" variant="outline" size="icon" onClick={() => handleDownload(formData.deadline_carga_file)} title={`Descarregar ${formData.deadline_carga_file.name}`} disabled={uploadProgresses[formData.deadline_carga_file.storagePath] > 0}>
                              <Download className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeFile('deadline_carga_file')} className="text-destructive hover:text-destructive" title="Remover anexo" disabled={uploadProgresses[formData.deadline_carga_file.storagePath] > 0}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="outline" size="icon" type="button" title="Anexar Comprovante" onClick={() => triggerFileUpload('deadline_carga_file')} className="shrink-0">
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
                      <div className="flex-1 p-2 min-h-10 border rounded-md text-sm bg-muted flex items-center overflow-hidden">
                        {renderFileState(formData.draft_bl_file)}
                      </div>
                       {formData.draft_bl_file ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <Button type="button" variant="outline" size="icon" onClick={() => handleDownload(formData.draft_bl_file)} title={`Descarregar ${formData.draft_bl_file.name}`} disabled={uploadProgresses[formData.draft_bl_file.storagePath] > 0}>
                            <Download className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeFile('draft_bl_file')} className="text-destructive hover:text-destructive" title="Remover anexo" disabled={uploadProgresses[formData.draft_bl_file.storagePath] > 0}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="icon" type="button" title="Anexar Draft BL" onClick={() => triggerFileUpload('draft_bl_file')} className="shrink-0">
                           <Upload className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Draft Certificado Fitossanitário</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-2 min-h-10 border rounded-md text-sm bg-muted flex items-center overflow-hidden">
                         {renderFileState(formData.draft_fito_file)}
                      </div>
                      {formData.draft_fito_file ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <Button type="button" variant="outline" size="icon" onClick={() => handleDownload(formData.draft_fito_file)} title={`Descarregar ${formData.draft_fito_file.name}`} disabled={uploadProgresses[formData.draft_fito_file.storagePath] > 0}>
                            <Download className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeFile('draft_fito_file')} className="text-destructive hover:text-destructive" title="Remover anexo" disabled={uploadProgresses[formData.draft_fito_file.storagePath] > 0}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="icon" type="button" title="Anexar Draft Fito" onClick={() => triggerFileUpload('draft_fito_file')} className="shrink-0">
                           <Upload className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Draft Certificado de Origem</Label>
                    <div className="flex items-center gap-2">
                       <div className="flex-1 p-2 min-h-10 border rounded-md text-sm bg-muted flex items-center overflow-hidden">
                         {renderFileState(formData.draft_co_file)}
                      </div>
                      {formData.draft_co_file ? (
                        <div className="flex items-center gap-1 shrink-0">
                          <Button type="button" variant="outline" size="icon" onClick={() => handleDownload(formData.draft_co_file)} title={`Descarregar ${formData.draft_co_file.name}`} disabled={uploadProgresses[formData.draft_co_file.storagePath] > 0}>
                            <Download className="h-4 w-4 text-green-600" />
                          </Button>
                           <Button type="button" variant="ghost" size="icon" onClick={() => removeFile('draft_co_file')} className="text-destructive hover:text-destructive" title="Remover anexo" disabled={uploadProgresses[formData.draft_co_file.storagePath] > 0}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="icon" type="button" title="Anexar Draft Origem" onClick={() => triggerFileUpload('draft_co_file')} className="shrink-0">
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
                <CardContent className="space-y-8 pt-6">
                  {/* NOTAS FISCAIS */}
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
                      {formData.notas_fiscais.map((nota: any) => (
                        <div key={nota.id} className="grid md:grid-cols-6 gap-4 items-end p-3 border rounded-md">
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <select value={nota.tipo} onChange={(e) => handleNotaFiscalChange(nota.id, 'tipo', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="Remessa">Remessa</option>
                                <option value="Retorno">NF do Produtor</option>
                                <option value="Exportação">Exportação</option>
                            </select>
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Chave de Acesso / Anexo</Label>
                            <div className='flex gap-2'>
                              <div className="flex-1 p-2 min-h-10 border rounded-md text-sm bg-muted flex items-center overflow-hidden">
                                {renderFileState(nota.file)}
                              </div>
                              {nota.file ? (
                                <div className="flex items-center gap-1 shrink-0">
                                  <Button type="button" variant="outline" size="icon" onClick={() => handleDownload(nota.file)} title={`Descarregar ${nota.file.name}`} disabled={uploadProgresses[nota.file.storagePath] > 0}>
                                    <Download className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button type="button" title="Remover Anexo" variant="ghost" size="icon" onClick={() => removeNotaFiscal(nota.id)} disabled={uploadProgresses[nota.file.storagePath] > 0}>
                                    <XCircle className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="outline" size="icon" type="button" title="Anexar XML/PDF" onClick={() => triggerFileUpload({ type: 'nota_fiscal', id: nota.id })} className="shrink-0">
                                    <FileUp className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Data Solicitação</Label>
                            <DatePicker date={nota.data_pedido} onDateChange={(date) => handleNotaFiscalChange(nota.id, 'data_pedido', date)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Data Recebimento</Label>
                            <DatePicker date={nota.data_recebida} onDateChange={(date) => handleNotaFiscalChange(nota.id, 'data_recebida', date)} />
                          </div>
                          <div className='flex items-end'>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeNotaFiscal(nota.id)} disabled={uploadProgresses[nota.file?.storagePath] > 0}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {formData.notas_fiscais.length === 0 && <p className='text-sm text-center text-muted-foreground py-4'>Nenhuma nota fiscal adicionada.</p>}
                    </div>
                  </div>

                  {/* DOCUMENTOS FISCAIS (DUE, LPCO, TRATAMENTO) */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-medium">Inspeção e Fiscalização (DUE, LPCO, Tratamento)</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addFiscalDoc}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Documento / Tratamento
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Tipo</TableHead>
                            <TableHead className="min-w-[200px]">Nº / Tipo Tratamento</TableHead>
                            <TableHead className="w-[250px]">Status</TableHead>
                            <TableHead className="w-[180px]">Data</TableHead>
                            <TableHead>Anexo</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.documentos_fiscais?.map((df: any) => (
                            <TableRow key={df.id}>
                              <TableCell>
                                <Select value={df.tipo} onValueChange={(val) => handleFiscalDocChange(df.id, 'tipo', val)}>
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fiscalDocTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                {df.tipo === 'TRATAMENTO' ? (
                                  <Select value={df.identificacao} onValueChange={(val) => handleFiscalDocChange(df.id, 'identificacao', val)}>
                                    <SelectTrigger className="h-9">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {treatmentTypeOptions.map(tt => <SelectItem key={tt} value={tt}>{tt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Input 
                                    className="h-9" 
                                    value={df.identificacao || ''} 
                                    placeholder={df.tipo === 'DUE' ? "Ex: 24BR00..." : "Ex: Protocolo LPCO"}
                                    onChange={(e) => handleFiscalDocChange(df.id, 'identificacao', e.target.value)} 
                                  />
                                )}
                              </TableCell>
                              <TableCell>
                                <Select value={df.status} onValueChange={(val) => handleFiscalDocChange(df.id, 'status', val)}>
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {df.tipo === 'DUE' && dueStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    {df.tipo === 'LPCO' && lpcoStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    {df.tipo === 'TRATAMENTO' && treatmentStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <DatePicker 
                                  date={df.data} 
                                  onDateChange={(val) => handleFiscalDocChange(df.id, 'data', val)} 
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 p-2 min-h-9 border rounded-md text-[10px] bg-muted flex items-center overflow-hidden min-w-[100px]">
                                    {renderFileState(df.file)}
                                  </div>
                                  {df.file ? (
                                    <div className="flex items-center gap-1 shrink-0">
                                      <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDownload(df.file)} disabled={uploadProgresses[df.file.storagePath] > 0}>
                                        <Download className="h-3 w-3 text-green-600" />
                                      </Button>
                                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFiscalDoc(df.id)} disabled={uploadProgresses[df.file.storagePath] > 0}>
                                        <XCircle className="h-3 w-3 text-destructive" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button variant="outline" size="icon" type="button" className="h-8 w-8 shrink-0" onClick={() => triggerFileUpload({ type: 'documento_fiscal', id: df.id })}>
                                      <Upload className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFiscalDoc(df.id)} disabled={uploadProgresses[df.file?.storagePath] > 0}>
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {(!formData.documentos_fiscais || formData.documentos_fiscais.length === 0) && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground py-4">Nenhum documento fiscal ou tratamento adicionado.</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* DADOS DOS CONTAINERS */}
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
                          {formData.containers.map((container: any, index: number) => (
                            <TableRow key={container.id}>
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

                  {/* CONTAINERS PARA INSPEÇÃO */}
                  <div>
                    <h3 className="text-md font-medium mb-2">Contêineres para Inspeção</h3>
                    <div className="space-y-2 rounded-md border p-4">
                      {formData.containers.map((container: any, index: number) => (
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
                      <Label htmlFor="navio_stage4">Navio / Viagem</Label>
                      <Input 
                        id="navio_stage4" 
                        value={formData.navio || ''} 
                        onChange={e => handleInputChange('navio', e.target.value)} 
                        placeholder="Ex: MSC EUGENIA / NAS21R" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data de Saída (ETD)</Label>
                        <DatePicker date={formData.etd} onDateChange={date => handleInputChange('etd', date)} showTime />
                      </div>
                      <div className="space-y-2">
                        <Label>Data de Chegada (ETA)</Label>
                        <DatePicker date={formData.eta} onDateChange={date => handleInputChange('eta', date)} showTime />
                      </div>
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
                        {formData.documentos_pos_embarque.map((docItem: any) => (
                          <TableRow key={docItem.id}>
                            <TableCell>
                              <Select value={docItem.nome || ''} onValueChange={value => handlePostShipmentDocChange(docItem.id, 'nome', value)}>
                                <SelectTrigger className="min-w-[180px] h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                <SelectContent>
                                  {documentTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input className="w-24 h-9" type="number" min="0" value={docItem.originais || '0'} onChange={e => handlePostShipmentDocChange(docItem.id, 'originais', e.target.value)} />
                            </TableCell>
                            <TableCell>
                              <Input className="w-24 h-9" type="number" min="0" value={docItem.copias || '0'} onChange={e => handlePostShipmentDocChange(docItem.id, 'copias', e.target.value)} />
                            </TableCell>
                            <TableCell>
                              <DatePicker
                                date={docItem.data_emissao}
                                onDateChange={date => handlePostShipmentDocChange(docItem.id, 'data_emissao', date)}
                              />
                            </TableCell>
                            <TableCell>
                              <DatePicker
                                date={docItem.data_liberacao}
                                onDateChange={date => handlePostShipmentDocChange(docItem.id, 'data_liberacao', date)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 p-2 min-h-9 border rounded-md text-[10px] bg-muted flex items-center overflow-hidden min-w-[120px]">
                                  {renderFileState(docItem.file)}
                                </div>
                                {docItem.file ? (
                                  <div className="flex items-center gap-1 shrink-0">
                                    <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDownload(docItem.file)} title={`Descarregar ${docItem.file.name}`} disabled={uploadProgresses[docItem.file.storagePath] > 0}>
                                      <Download className="h-3 w-3 text-green-600" />
                                    </Button>
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Remover Anexo" onClick={() => removePostShipmentDoc(docItem.id)} disabled={uploadProgresses[docItem.file.storagePath] > 0}>
                                      <XCircle className="h-3 w-3 text-destructive" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button variant="outline" size="icon" type="button" className="h-8 w-8 shrink-0" title="Anexar" onClick={() => triggerFileUpload({ type: 'documento_pos_embarque', id: docItem.id })}>
                                    <Upload className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removePostShipmentDoc(docItem.id)} disabled={uploadProgresses[docItem.file?.storagePath] > 0}>
                                <Trash2 className="h-3 w-3 text-destructive" />
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
                  <Button className='w-full' type="button" onClick={() => handleInputChange('status', 'Concluído')}>
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
