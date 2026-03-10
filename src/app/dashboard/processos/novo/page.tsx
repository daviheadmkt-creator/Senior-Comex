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
import { 
  ArrowLeft, 
  CheckCircle, 
  Upload, 
  XCircle, 
  PlusCircle, 
  Trash2, 
  FileDown, 
  Loader2, 
  FileUp, 
  Download, 
  Save 
} from 'lucide-react';
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
import { 
  useCollection, 
  useDoc, 
  useFirestore, 
  useMemoFirebase, 
  useUser, 
  useStorage, 
  updateDocumentNonBlocking 
} from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Combobox } from '@/components/ui/combobox';
import { Progress } from '@/components/ui/progress';

const MAX_FILE_SIZE_MB = 10;

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

const dueStatusOptions = ["RASCUNHO SALVO", "REGISTRADA", "AGUARDANDO ENTREGA DO CARGA/PARAMETRIZAÇÃO", "DESEMABRAÇADA", "SELECIONADA/CANAL LARANJA", "SELECIONADA/CANAL VERMELHO", "DESEMBARAÇADA", "RETIFICAÇÃO", "AVERBADA"];
const lpcoStatusOptions = ["RASCUNHO SALVO", "REGISTRADA/EM ANALISE", "REGISTRADA/EM EXIGENCIA", "REGISTRADA/AGUARDANDO INSPEÇÃO FISICA", "EM EXIGENCIA/NFA", "EM RETIFICAÇÃO", "INDEFERIDA", "DEFERIDA", "DEFERIDA/CERTIFICADO EMITIDO"];
const treatmentStatusOptions = ["SOLICITADO", "AGENDADO", "REALIZADO", "CERTIFICADO EMITIDO", "CANCELADO"];
const treatmentTypeOptions = ["BROMETO OFICIAL", "FOSFINA OFICIAL", "FOSFINA NÃO OFICIAL"];
const documentTypes = ["INVOICE", "PACKING LIST", "BL", "FITO", "ORIGEM", "WEIGHT", "QUALITY", "HEALTH", "NON GMO", "ANALISE", "FUMIGATION", "SET DOC ENVIADO", "DOC SENT (ALL PDF)"];
const fiscalDocTypes = ["DUE", "LPCO", "TRATAMENTO"];

const initialFormData = {
  processo_interno: '',
  data_nomeacao: null,
  po_number: '',
  produtoNome: '',
  quantidade: '',
  exportadorId: '',
  portoEmbarqueId: '',
  portoDescargaId: '',
  terminalDespachoId: '',
  terminalEmbarqueId: '',
  destino: '',
  status: 'NOMEAÇÃO RECEBIDA',
  booking_number: '',
  armadorId: '',
  navio: '',
  viagem: '',
  containers: [],
  data_containers: null,
  documentos_pos_embarque: [],
  notas_fiscais: [],
  documentos_fiscais: [],
  awb_courier: '',
  analistaId: '',
  analistaNome: '',
  draft_bl_file: null,
  draft_fito_file: null,
  draft_co_file: null,
  deadline_draft: null,
  deadline_vgm: null,
  deadline_carga: null,
  etd: null,
  eta: null,
  deadline_draft_file: null,
  deadline_vgm_file: null,
  deadline_carga_file: null,
};

function sanitizeFileName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '');
}

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

export default function NovoProcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = useStorage();
  const { user: currentUser } = useUser();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nfFileInputRef = useRef<HTMLInputElement>(null);
  const containerFileInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);
  
  const [formData, setFormData] = useState<any>(initialFormData);
  const [uploadTarget, setUploadTarget] = useState<string | { type: string, id: string | number } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgresses, setUploadProgresses] = useState<Record<string, number>>({});
  const [exporterContacts, setExporterContacts] = useState<any[]>([]);

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

  const partnersMap = useMemo(() => {
    if (!parceiros) return new Map();
    return new Map(parceiros.map(p => [p.id, p.nome_fantasia || p.razao_social]));
  }, [parceiros]);

  const portsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'ports') : null, [firestore]);
  const { data: portos, isLoading: isLoadingPorts } = useCollection(portsCollection);

  const portsMap = useMemo(() => {
    if (!portos) return new Map();
    return new Map(portos.map(p => [p.id, p.name]));
  }, [portos]);

  const terminaisCollection = useMemoFirebase(() => firestore ? collection(firestore, 'terminals') : null, [firestore]);
  const { data: terminais, isLoading: isLoadingTerminals } = useCollection(terminaisCollection);

  const terminalsMap = useMemo(() => {
    if (!terminais) return new Map();
    return new Map(terminais.map(t => [t.id, t.name]));
  }, [terminais]);

  const isUploading = useMemo(() => {
    return Object.values(uploadProgresses).some(p => p > 0 && p < 100);
  }, [uploadProgresses]);

  useEffect(() => {
    if (isEditing && processoData && parceiros && !hasInitialized.current) {
      const selectedExporter = parceiros?.find(p => p.id === processoData.exportadorId);
      const newContacts = selectedExporter?.contatos?.filter((c: any) => c.nome).map((c: any, index: number) => ({ ...c, id: String(index) })) || [];
      setExporterContacts(newContacts);

      setFormData({
        ...initialFormData,
        ...processoData,
        status: processoData.status || 'NOMEAÇÃO RECEBIDA',
        containers: processoData.containers || [],
        data_containers: processoData.data_containers || null,
        documentos_pos_embarque: processoData.documentos_pos_embarque || [],
        notas_fiscais: processoData.notas_fiscais || [],
        documentos_fiscais: processoData.documentos_fiscais || [],
      });
      
      hasInitialized.current = true;
    }
  }, [isEditing, processoData, parceiros]);

  const isLoading = isLoadingProcesso || isLoadingParceiros || isLoadingPorts || isLoadingTerminals;

  const handleInputChange = (id: string, value: any) => {
    setFormData((prev: any) => {
        if (id === 'status' && !value) return prev;
        return { ...prev, [id]: value ?? '' };
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    if (!digitsOnly) { handleInputChange('quantidade', ''); return; }
    const formatted = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 5, maximumFractionDigits: 5 }).format(parseInt(digitsOnly, 10) / 100000);
    handleInputChange('quantidade', `${formatted} TON`);
  };

  const validarArquivo = (file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) throw new Error(`Limite de ${MAX_FILE_SIZE_MB}MB excedido.`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !uploadTarget || !storage || !pageProcessId) return;

      try {
          validarArquivo(file);
          
          const targetField = typeof uploadTarget === 'string' ? uploadTarget : null;
          const targetObj = typeof uploadTarget === 'object' ? uploadTarget : null;
          const targetId = targetObj ? (targetObj as any).id : null;
          const targetList = targetObj ? (targetObj as any).type : null;

          const safeName = sanitizeFileName(file.name);
          const filePath = `processos/${pageProcessId}/${Date.now()}-${safeName}`;
          const storageRef = ref(storage, filePath);
          const contentType = file.type || (file.name.toLowerCase().endsWith('.xml') ? 'application/xml' : 'application/octet-stream');
          
          const placeholder: FileData = {
              name: file.name,
              storagePath: filePath,
              downloadURL: '',
              type: contentType,
              size: file.size,
              uploadState: 'running',
              uploadProgress: 1
          };

          setFormData((prev: any) => {
              if (targetField) return { ...prev, [targetField]: placeholder };
              if (targetList === 'nota_fiscal') return { ...prev, notas_fiscais: prev.notas_fiscais.map((nf: any) => nf.id === targetId ? { ...nf, file: placeholder } : nf) };
              if (targetList === 'documento_pos_embarque') return { ...prev, documentos_pos_embarque: prev.documentos_pos_embarque.map((d: any) => d.id === targetId ? { ...d, file: placeholder } : d) };
              if (targetList === 'documento_fiscal') return { ...prev, documentos_fiscais: (prev.documentos_fiscais || []).map((df: any) => df.id === targetId ? { ...df, file: placeholder } : df) };
              return prev;
          });

          setUploadProgresses(prev => ({ ...prev, [filePath]: 1 }));

          const uploadTask = uploadBytesResumable(storageRef, file, { contentType });

          let lastProg = 0;
          uploadTask.on('state_changed',
              (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  if (Math.abs(progress - lastProg) < 5 && progress < 100) return;
                  lastProg = progress;
                  setUploadProgresses(prev => ({ ...prev, [filePath]: progress }));
              },
              (error: any) => {
                  setUploadProgresses(prev => { const s = {...prev}; delete s[filePath]; return s; });
                  toast({ title: "Falha no Upload", description: error.message, variant: "destructive" });
              },
              async () => {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  const finalFileData = { ...placeholder, downloadURL, uploadState: 'success' as const, uploadProgress: 100 };
                  
                  setUploadProgresses(prev => { const s = {...prev}; delete s[filePath]; return s; });

                  setFormData((prev: any) => {
                      const newState = { ...prev };
                      if (targetField) {
                          newState[targetField] = finalFileData;
                          if (firestore && pageProcessId) updateDocumentNonBlocking(doc(firestore, 'processos', pageProcessId), { [targetField]: finalFileData });
                      } else if (targetList === 'nota_fiscal') {
                          newState.notas_fiscais = prev.notas_fiscais.map((nf: any) => nf.id === targetId ? { ...nf, file: finalFileData } : nf);
                          if (firestore && pageProcessId) updateDocumentNonBlocking(doc(firestore, 'processos', pageProcessId), { notas_fiscais: newState.notas_fiscais });
                      } else if (targetList === 'documento_pos_embarque') {
                          newState.documentos_pos_embarque = prev.documentos_pos_embarque.map((d: any) => d.id === targetId ? { ...d, file: finalFileData } : d);
                          if (firestore && pageProcessId) updateDocumentNonBlocking(doc(firestore, 'processos', pageProcessId), { documentos_pos_embarque: newState.documentos_pos_embarque });
                      } else if (targetList === 'documento_fiscal') {
                          newState.documentos_fiscais = prev.documentos_fiscais.map((df: any) => df.id === targetId ? { ...df, file: finalFileData } : df);
                          if (firestore && pageProcessId) updateDocumentNonBlocking(doc(firestore, 'processos', pageProcessId), { documentos_fiscais: newState.documentos_fiscais });
                      }
                      return newState;
                  });
              }
          );
      } catch (err: any) { toast({ title: "Erro", description: err.message, variant: "destructive" }); }
      setUploadTarget(null);
  };

  const removeFile = (target: string | { type: string, id: string | number }) => {
    if (!storage || !firestore || !pageProcessId) return;
    let fileToRemove: FileData | null = null;
    let syncData: any = {};

    setFormData((prev: any) => {
        const newState = { ...prev };
        if (typeof target === 'string') {
            fileToRemove = prev[target];
            newState[target] = null;
            syncData[target] = null;
        } else {
            const key = target.type === 'nota_fiscal' ? 'notas_fiscais' : target.type === 'documento_pos_embarque' ? 'documentos_pos_embarque' : 'documentos_fiscais';
            newState[key] = prev[key].map((item: any) => {
                if (item.id === target.id) { fileToRemove = item.file; return { ...item, file: null }; }
                return item;
            });
            syncData[key] = newState[key];
        }
        updateDocumentNonBlocking(doc(firestore, 'processos', pageProcessId), syncData);
        return newState;
    });

    if (fileToRemove?.storagePath) deleteObject(ref(storage, fileToRemove.storagePath)).catch(() => {});
  };

  const triggerFileUpload = (target: string | object) => { setUploadTarget(target as any); fileInputRef.current?.click(); };

  const getStepStatusIcon = (step: number) => {
    const status = formData.status;
    const idx = processStatusOptions.indexOf(status);
    const thresholds = [0, 3, 9, 17, 20, 30];
    if (idx >= thresholds[step - 1]) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-gray-400" />;
  };

  const handleFiscalDocChange = (id: string | number, field: string, value: any) => {
    setFormData((prev: any) => {
      const updatedList = (prev.documentos_fiscais || []).map((df: any) => {
        if (df.id === id) {
          const updated = { ...df, [field]: value };
          if (field === 'tipo') {
            if (value === 'DUE' || value === 'LPCO') updated.status = 'RASCUNHO SALVO';
            else if (value === 'TRATAMENTO') { updated.status = 'SOLICITADO'; updated.identificacao = 'BROMETO OFICIAL'; }
          }
          return updated;
        }
        return df;
      });
      if (firestore && pageProcessId) updateDocumentNonBlocking(doc(firestore, 'processos', pageProcessId), { documentos_fiscais: updatedList });
      return { ...prev, documentos_fiscais: updatedList };
    });
  };

  const handlePostShipmentDocChange = (id: string | number, field: string, value: any) => {
    setFormData((prev: any) => {
      const newList = prev.documentos_pos_embarque.map((d: any) => d.id === id ? { ...d, [field]: value } : d);
      if (firestore && pageProcessId) updateDocumentNonBlocking(doc(firestore, 'processos', pageProcessId), { documentos_pos_embarque: newList });
      return { ...prev, documentos_pos_embarque: newList };
    });
  };

  const handleNotaFiscalChange = (id: string | number, field: string, value: any) => {
    setFormData((prev: any) => {
      const newList = prev.notas_fiscais.map((nf: any) => nf.id === id ? { ...nf, [field]: value } : nf);
      if (firestore && pageProcessId) updateDocumentNonBlocking(doc(firestore, 'processos', pageProcessId), { notas_fiscais: newList });
      return { ...prev, notas_fiscais: newList };
    });
  };

  const handleContainerChange = (index: number, field: string, value: any) => {
    const updated = [...formData.containers];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, containers: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) { toast({ title: 'Aguarde', description: 'Termine os uploads antes de salvar.' }); return; }
    if (!firestore || !pageProcessId) return;
    setIsSaving(true);
    try {
      const ref = doc(firestore, 'processos', pageProcessId);
      const finalStatus = formData.status || processoData?.status || 'NOMEAÇÃO RECEBIDA';
      
      const payload = { 
        ...formData, 
        id: pageProcessId,
        status: finalStatus,
        exportadorNome: partnersMap.get(formData.exportadorId) || '',
        portoEmbarqueNome: portsMap.get(formData.portoEmbarqueId) || '',
        portoDescargaNome: portsMap.get(formData.portoDescargaId) || '',
        terminalDespachoNome: terminalsMap.get(formData.terminalDespachoId) || '',
        terminalEmbarqueNome: terminalsMap.get(formData.terminalEmbarqueId) || '',
        armadorNome: partnersMap.get(formData.armadorId) || '',
      };

      await setDoc(ref, payload, { merge: true });
      toast({ title: "Sucesso!", description: "Processo salvo com sucesso." });
      router.push('/dashboard/processos');
    } catch { toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" }); }
    finally { setIsSaving(false); }
  };

  const handleDownload = (file: FileData) => { if (file.downloadURL) window.open(file.downloadURL, '_blank'); };

  const generateOriginalDocsPdf = async () => {
    const { default: jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    const docPdf = new jsPDF();
    docPdf.text('Documentos de Embarque', 10, 10);
    (docPdf as any).autoTable({
      head: [['Nome', 'Originais', 'Cópias', 'Emissão', 'Liberação']],
      body: formData.documentos_pos_embarque.map((d: any) => [d.nome, d.originais, d.copias, d.data_emissao || 'N/A', d.data_liberacao || 'N/A']),
    });
    docPdf.save(`Docs_${formData.processo_interno}.pdf`);
  };

  const generateNFsPdf = async () => {
    const { default: jsPDF } = await import('jspdf');
    await import('jspdf-autotable');
    const docPdf = new jsPDF();
    docPdf.text('Pacote de Notas Fiscais', 10, 10);
    (docPdf as any).autoTable({
      head: [['Tipo', 'Chave', 'Data Pedido', 'Data Recebida']],
      body: formData.notas_fiscais.map((n: any) => [n.tipo, n.chave || '---', n.data_pedido || 'N/A', n.data_recebida || 'N/A']),
    });
    docPdf.save(`NFs_${formData.processo_interno}.pdf`);
  };

  const handleContainerImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const XLSX = await import('xlsx');
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      const now = new Date().toISOString();
      const newContainers = json.map((r: any) => ({ 
        id: Date.now() + Math.random(), 
        numero: String(r.numero || r.numero_container || ''),
        lacre_original: String(r.lacre || r.lacre_original || ''),
        tare: String(r.tare || ''),
        qty_especie: String(r.qty_especie || ''),
        gross_weight: String(r.gross_weight || ''),
        net_weight: String(r.net_weight || ''),
        m3: String(r.m3 || ''),
        vgm: String(r.vgm || ''),
        tipo: String(r.tipo || ''),
        inspecionado: false,
        novo_lacre: ''
      }));
      setFormData(prev => ({ 
        ...prev, 
        containers: [...prev.containers, ...newContainers],
        data_containers: now
      }));
      setIsImporting(false);
      toast({ title: "Importação Concluída", description: `${newContainers.length} contêineres adicionados.` });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleMultipleNFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !pageProcessId || !storage) return;
    
    Array.from(files).forEach((file, index) => {
      try {
        validarArquivo(file);
        const id = `${Date.now()}-${index}`;
        const safeName = sanitizeFileName(file.name);
        const filePath = `processos/${pageProcessId}/${id}-${safeName}`;
        const contentType = file.type || 'application/pdf';
        
        const placeholder: FileData = { name: file.name, storagePath: filePath, downloadURL: '', type: contentType, size: file.size, uploadState: 'running', uploadProgress: 1 };
        
        setFormData((prev: any) => ({
          ...prev,
          notas_fiscais: [...prev.notas_fiscais, { id, tipo: 'Exportação', chave: '', data_pedido: null, data_recebida: null, file: placeholder }]
        }));

        const uploadTask = uploadBytesResumable(ref(storage, filePath), file, { contentType });
        setUploadProgresses(prev => ({ ...prev, [filePath]: 1 }));

        uploadTask.on('state_changed', 
          snapshot => {
            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgresses(prev => ({ ...prev, [filePath]: prog }));
          },
          err => toast({ title: "Falha", description: err.message }),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            const final = { ...placeholder, downloadURL: url, uploadState: 'success', uploadProgress: 100 };
            setUploadProgresses(prev => { const s = {...prev}; delete s[filePath]; return s; });
            setFormData((prev: any) => {
              const newList = prev.notas_fiscais.map((n: any) => n.id === id ? { ...n, file: final } : n);
              if (firestore) updateDocumentNonBlocking(doc(firestore, 'processos', pageProcessId), { notas_fiscais: newList });
              return { ...prev, notas_fiscais: newList };
            });
          }
        );
      } catch(e: any) { toast({ title: "Erro", description: e.message }); }
    });
  };

  const renderFileState = (file: FileData | null) => {
    if (!file) return <span className="text-muted-foreground italic text-xs">Nenhum ficheiro.</span>;
    const prog = uploadProgresses[file.storagePath] ?? (file.uploadState === 'success' ? 100 : 0);
    if (prog > 0 && prog < 100) return (
        <div className="flex flex-col gap-1 w-full py-1">
          <div className="flex justify-between text-[10px] font-medium"><span>A carregar...</span><span>{Math.round(prog)}%</span></div>
          <Progress value={prog} className="h-1.5" />
        </div>
    );
    if (prog === 100 && file.uploadState !== 'success') return <div className='flex items-center gap-2 text-[10px]'><Loader2 className='h-3 w-3 animate-spin'/>A finalizar...</div>;
    return (
      <div className="flex items-center gap-2 overflow-hidden w-full">
        <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
        <span className="truncate text-xs flex-1">{file.name}</span>
        {file.downloadURL && (
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => handleDownload(file)}
            title="Descarregar ficheiro"
          >
            <Download className="h-3 w-3 text-primary" />
          </Button>
        )}
      </div>
    );
  };

  const pageTitle = isEditing ? `Editar Processo ${formData.processo_interno || ''}` : 'Novo Processo';

  if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-start">
          <div className='flex items-center gap-4'>
            <Link href="/dashboard/processos" passHref><Button variant="outline" size="icon" type="button"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
              <div className='mt-2'>
                <Select value={formData.status || 'NOMEAÇÃO RECEBIDA'} onValueChange={v => handleInputChange('status', v)}>
                  <SelectTrigger className="w-[350px] h-10 text-xs bg-background shadow-sm border-primary/20">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "h-2.5 w-2.5 rounded-full shrink-0",
                        getStatusVariant(formData.status) === 'default' && 'bg-green-500',
                        getStatusVariant(formData.status) === 'secondary' && 'bg-yellow-500',
                        getStatusVariant(formData.status) === 'destructive' && 'bg-red-500',
                        getStatusVariant(formData.status) === 'outline' && 'bg-gray-400'
                      )}></span>
                      <SelectValue placeholder="Status do Processo" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>{processStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => router.push('/dashboard/processos')}>Cancelar</Button>
            <Button type="submit" disabled={isSaving || isUploading}>{isSaving ? 'A guardar...' : 'Salvar Alterações'}</Button>
          </div>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xml,.pdf,image/*" />
        <input type="file" ref={nfFileInputRef} onChange={handleMultipleNFUpload} className="hidden" accept=".xml,.pdf,image/*" multiple />
        <input type="file" ref={containerFileInputRef} onChange={handleContainerImport} className="hidden" accept=".xlsx,.xls" />

        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger><div className='flex items-center gap-3'>{getStepStatusIcon(1)}<h3 className="text-lg font-semibold text-left">Etapa 1: Dados do Processo e Reserva</h3></div></AccordionTrigger>
            <AccordionContent>
              <Card><CardContent className="grid gap-8 pt-6">
                {/* 1.1 Básicos */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Processo Interno</Label><Input value={formData.processo_interno || ''} onChange={e => handleInputChange('processo_interno', e.target.value)} /></div>
                  <div className="space-y-2"><Label>PO</Label><Input value={formData.po_number || ''} onChange={e => handleInputChange('po_number', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Data Nomeação</Label><DatePicker date={formData.data_nomeacao} onDateChange={d => handleInputChange('data_nomeacao', d)} /></div>
                </div>

                {/* 1.2 Comercial */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Exportador</Label>
                    <Combobox items={parceiros?.filter(p => p.tipo_parceiro === 'Exportador').map(p => ({ value: p.id, label: p.nome_fantasia || p.razao_social })) || []} value={formData.exportadorId} onValueChange={v => {
                      handleInputChange('exportadorId', v);
                      const selected = parceiros?.find(p => p.id === v);
                      setExporterContacts(selected?.contatos?.map((c: any, i: number) => ({ ...c, id: String(i) })) || []);
                    }} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contato</Label>
                    <Combobox items={exporterContacts.map(c => ({ value: String(c.id), label: c.nome }))} value={String(formData.analistaId || '')} onValueChange={id => { 
                      const c = exporterContacts.find(x => String(x.id) === id); 
                      handleInputChange('analistaId', id); 
                      handleInputChange('analistaNome', c?.nome || ''); 
                    }} disabled={!formData.exportadorId} />
                  </div>
                </div>

                {/* 1.3 Carga */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2"><Label>Produto</Label><Input value={formData.produtoNome || ''} onChange={e => handleInputChange('produtoNome', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Quantidade</Label><Input value={formData.quantidade || ''} onChange={handleQuantityChange} /></div>
                </div>

                {/* 1.4 Booking & Armador */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="space-y-2"><Label>Navio</Label><Input value={formData.navio || ''} onChange={e => handleInputChange('navio', e.target.value)} placeholder="Nome do navio" /></div>
                  <div className="space-y-2"><Label>Viagem</Label><Input value={formData.viagem || ''} onChange={e => handleInputChange('viagem', e.target.value)} placeholder="Número da viagem" /></div>
                  <div className="space-y-2"><Label>Número do Booking</Label><Input value={formData.booking_number || ''} onChange={e => handleInputChange('booking_number', e.target.value)} /></div>
                  <div className="space-y-2">
                    <Label>Armador</Label>
                    <Combobox items={parceiros?.filter(p => p.tipo_parceiro === 'Armador').map(p => ({ value: p.id, label: p.nome_fantasia || p.razao_social })) || []} value={formData.armadorId} onValueChange={v => handleInputChange('armadorId', v)} />
                  </div>
                </div>

                {/* 1.5 Rota */}
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Porto de Embarque (Origem)</Label>
                    <Combobox items={portos?.map(p => ({ value: p.id, label: p.name })) || []} value={formData.portoEmbarqueId} onValueChange={v => handleInputChange('portoEmbarqueId', v)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Porto de Descarga</Label>
                    <Combobox items={portos?.map(p => ({ value: p.id, label: p.name })) || []} value={formData.portoDescargaId} onValueChange={v => handleInputChange('portoDescargaId', v)} />
                  </div>
                  <div className="space-y-2"><Label>Destino Final</Label><Input value={formData.destino || ''} onChange={e => handleInputChange('destino', e.target.value)} /></div>
                </div>

                {/* 1.6 Terminais */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Terminal de Despacho (REDEX)</Label>
                    <Select value={formData.terminalDespachoId} onValueChange={v => handleInputChange('terminalDespachoId', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingTerminals ? "Carregando..." : "Selecione o terminal"} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingTerminals && <SelectItem value="loading" disabled>A carregar terminais...</SelectItem>}
                        {!isLoadingTerminals && terminais?.filter(t => !formData.portoEmbarqueId || String(t.portoId) === String(formData.portoEmbarqueId)).map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                        {!isLoadingTerminals && (!terminais || terminais.filter(t => !formData.portoEmbarqueId || String(t.portoId) === String(formData.portoEmbarqueId)).length === 0) && (
                          <SelectItem value="none" disabled>Nenhum terminal encontrado para este porto</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Terminal de Embarque</Label>
                    <Select value={formData.terminalEmbarqueId} onValueChange={v => handleInputChange('terminalEmbarqueId', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingTerminals ? "Carregando..." : "Selecione o terminal"} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingTerminals && <SelectItem value="loading" disabled>A carregar terminais...</SelectItem>}
                        {!isLoadingTerminals && terminais?.filter(t => !formData.portoEmbarqueId || String(t.portoId) === String(formData.portoEmbarqueId)).map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                        {!isLoadingTerminals && (!terminais || terminais.filter(t => !formData.portoEmbarqueId || String(t.portoId) === String(formData.portoEmbarqueId)).length === 0) && (
                          <SelectItem value="none" disabled>Nenhum terminal encontrado para este porto</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 1.7 Deadlines */}
                <div className="grid md:grid-cols-3 gap-6 pt-4 border-t">
                    {['deadline_draft', 'deadline_vgm', 'deadline_carga'].map(field => (
                        <div key={field} className="space-y-2">
                            <Label className="capitalize font-bold text-xs">{field.replace('_', ' ')}</Label>
                            <DatePicker date={formData[field]} onDateChange={d => handleInputChange(field, d)} showTime />
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 p-2 border rounded-md bg-muted overflow-hidden">{renderFileState(formData[`${field}_file`])}</div>
                                {formData[`${field}_file`] ? <Button variant="ghost" size="icon" type="button" onClick={() => removeFile(`${field}_file`)}><XCircle className="h-4 w-4" /></Button> : <Button variant="outline" size="icon" type="button" onClick={() => triggerFileUpload(`${field}_file`)}><Upload className="h-4 w-4" /></Button>}
                            </div>
                        </div>
                    ))}
                </div>
              </CardContent></Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" disabled={!isEditing}>
            <AccordionTrigger><div className='flex items-center gap-3'>{getStepStatusIcon(2)}<h3 className="text-lg font-semibold text-left">Etapa 2: Drafts</h3></div></AccordionTrigger>
            <AccordionContent>
              <Card><CardContent className="space-y-6 pt-6">
                {['draft_bl_file', 'draft_fito_file', 'draft_co_file'].map(field => (
                    <div key={field} className="space-y-2">
                        <Label className="uppercase font-bold text-xs">{field.replace('_file', '').replace('draft_', '').replace('co', 'CERT. ORIGEM').replace('fito', 'CERT. FITO')}</Label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 p-2 border rounded-md bg-muted overflow-hidden">{renderFileState(formData[field])}</div>
                            {formData[field] ? <Button variant="ghost" size="icon" type="button" onClick={() => removeFile(field)}><Trash2 className="h-4 w-4 text-destructive" /></Button> : <Button variant="outline" size="icon" type="button" onClick={() => triggerFileUpload(field)}><Upload className="h-4 w-4" /></Button>}
                        </div>
                    </div>
                ))}
              </CardContent></Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" disabled={!isEditing}>
            <AccordionTrigger><div className='flex items-center gap-3'>{getStepStatusIcon(3)}<h3 className="text-lg font-semibold text-left">Etapa 3: Inspeção e Fiscalização</h3></div></AccordionTrigger>
            <AccordionContent>
              <Card><CardContent className="space-y-8 pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-bold text-primary uppercase">Notas Fiscais</h3>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" type="button" onClick={generateNFsPdf} disabled={formData.notas_fiscais.length === 0}>
                        <FileDown className="mr-2 h-4 w-4" /> PDF Notas
                      </Button>
                      <Button variant="outline" size="sm" type="button" onClick={() => nfFileInputRef.current?.click()}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Notas
                      </Button>
                    </div>
                  </div>
                  <Table>
                    <TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Chave / ID</TableHead><TableHead>Datas Operacionais</TableHead><TableHead>Anexo</TableHead><TableHead></TableHead></TableRow></TableHeader>
                    <TableBody>{formData.notas_fiscais.map((nf: any) => (
                      <TableRow key={nf.id}>
                        <TableCell><select value={nf.tipo} onChange={e => handleNotaFiscalChange(nf.id, 'tipo', e.target.value)} className="bg-transparent text-xs border rounded p-1"><option value="Remessa">Remessa</option><option value="Retorno">NF Produtor</option><option value="Exportação">Exportação</option></select></TableCell>
                        <TableCell><Input value={nf.chave} onChange={e => handleNotaFiscalChange(nf.id, 'chave', e.target.value)} className="h-8 text-xs" placeholder="Chave de acesso" /></TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2 min-w-[180px]">
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Solicitado</span>
                              <DatePicker date={nf.data_pedido} onDateChange={d => handleNotaFiscalChange(nf.id, 'data_pedido', d)} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Recebido</span>
                              <DatePicker date={nf.data_recebida} onDateChange={d => handleNotaFiscalChange(nf.id, 'data_recebida', d)} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><div className="flex items-center gap-2"><div className="flex-1 p-2 border rounded-md bg-muted min-w-[120px] overflow-hidden">{renderFileState(nf.file)}</div>{nf.file ? <Button variant="ghost" size="icon" type="button" onClick={() => removeFile({ type: 'nota_fiscal', id: nf.id })}><Trash2 className="h-3 w-3" /></Button> : <Button variant="outline" size="icon" type="button" onClick={() => triggerFileUpload({ type: 'nota_fiscal', id: nf.id })}><Upload className="h-3 w-3" /></Button>}</div></TableCell>
                        <TableCell><Button variant="ghost" size="icon" type="button" onClick={() => handleInputChange('notas_fiscais', formData.notas_fiscais.filter((x: any) => x.id !== nf.id))}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}</TableBody>
                  </Table>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-bold text-primary uppercase">DUE, LPCO e Tratamento</h3>
                    <Button variant="outline" size="sm" type="button" onClick={() => handleInputChange('documentos_fiscais', [...(formData.documentos_fiscais || []), { id: Date.now(), tipo: 'DUE', identificacao: '', status: 'RASCUNHO SALVO', data: null, file: null }])}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Fiscal
                    </Button>
                  </div>
                  <div className="overflow-x-auto rounded-md border">
                    <Table><TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Identificação</TableHead><TableHead>Status</TableHead><TableHead>Data</TableHead><TableHead>Anexo</TableHead><TableHead></TableHead></TableRow></TableHeader>
                    <TableBody>{formData.documentos_fiscais?.map((df: any) => (
                      <TableRow key={df.id}>
                        <TableCell><Select value={df.tipo} onValueChange={v => handleFiscalDocChange(df.id, 'tipo', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{fiscalDocTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></TableCell>
                        <TableCell>{df.tipo === 'TRATAMENTO' ? <Select value={df.identificacao} onValueChange={v => handleFiscalDocChange(df.id, 'identificacao', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{treatmentTypeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select> : <Input value={df.identificacao} onChange={e => handleFiscalDocChange(df.id, 'identificacao', e.target.value)} />}</TableCell>
                        <TableCell><Select value={df.status} onValueChange={v => handleFiscalDocChange(df.id, 'status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{df.tipo === 'DUE' ? dueStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>) : df.tipo === 'LPCO' ? lpcoStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>) : treatmentStatusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></TableCell>
                        <TableCell><DatePicker date={df.data} onDateChange={v => handleFiscalDocChange(df.id, 'data', v)} /></TableCell>
                        <TableCell><div className="flex items-center gap-2"><div className="flex-1 p-2 border rounded-md min-w-[120px] bg-muted overflow-hidden">{renderFileState(df.file)}</div>{df.file ? <Button variant="ghost" size="icon" type="button" onClick={() => removeFile({ type: 'documento_fiscal', id: df.id })}><Trash2 className="h-3 w-3" /></Button> : <Button variant="outline" size="icon" type="button" onClick={() => triggerFileUpload({ type: 'documento_fiscal', id: df.id })}><Upload className="h-3 w-3" /></Button>}</div></TableCell>
                        <TableCell><Button variant="ghost" size="icon" type="button" onClick={() => handleInputChange('documentos_fiscais', formData.documentos_fiscais.filter((x: any) => x.id !== df.id))}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}</TableBody></Table>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4">
                    <div className='flex justify-between items-center'>
                      <h3 className="text-md font-bold text-primary uppercase">Gestão de Contêineres</h3>
                      <div className='flex gap-2'>
                        <Button variant="outline" size="sm" type="button" onClick={() => containerFileInputRef.current?.click()} disabled={isImporting}>
                          {isImporting ? <Loader2 className='mr-2 h-4 w-4 animate-spin'/> : <FileUp className='mr-2 h-4 w-4'/>}
                          Importar XLSX
                        </Button>
                        <Button variant="outline" size="sm" type="button" onClick={() => {
                          const now = new Date().toISOString();
                          const newContainers = [...formData.containers, { id: Date.now(), numero: '', tare: '', qty_especie: '', gross_weight: '', net_weight: '', m3: '', vgm: '', lacre_original: '', inspecionado: false, novo_lacre: '' }];
                          setFormData(prev => ({ ...prev, containers: newContainers, data_containers: now }));
                        }}>
                          <PlusCircle className='mr-2 h-4 w-4'/> Add Manual
                        </Button>
                      </div>
                    </div>
                    <div className='overflow-x-auto rounded-md border'>
                      <Table className="min-w-[1200px]">
                        <TableHeader>
                          <TableRow className='bg-muted/50'>
                            <TableHead className='w-[150px]'>Número</TableHead>
                            <TableHead className='w-[150px]'>Lacre Original</TableHead>
                            <TableHead className='w-[100px]'>Tara</TableHead>
                            <TableHead className='w-[100px]'>Qty/Espécie</TableHead>
                            <TableHead className='w-[120px]'>Peso Bruto</TableHead>
                            <TableHead className='w-[120px]'>Peso Líquido</TableHead>
                            <TableHead className='w-[100px]'>M3</TableHead>
                            <TableHead className='w-[120px]'>VGM</TableHead>
                            <TableHead className='w-[50px]'></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.containers.map((c: any, index: number) => (
                            <TableRow key={c.id}>
                              <TableCell><Input value={c.numero} onChange={e => handleContainerChange(index, 'numero', e.target.value)} placeholder="CAAU..." className='h-8 text-xs font-mono'/></TableCell>
                              <TableCell><Input value={c.lacre_original} onChange={e => handleContainerChange(index, 'lacre_original', e.target.value)} placeholder="MLBR..." className='h-8 text-xs'/></TableCell>
                              <TableCell><Input value={c.tare} onChange={e => handleContainerChange(index, 'tare', e.target.value)} className='h-8 text-xs'/></TableCell>
                              <TableCell><Input value={c.qty_especie} onChange={e => handleContainerChange(index, 'qty_especie', e.target.value)} className='h-8 text-xs'/></TableCell>
                              <TableCell><Input value={c.gross_weight} onChange={e => handleContainerChange(index, 'gross_weight', e.target.value)} className='h-8 text-xs'/></TableCell>
                              <TableCell><Input value={c.net_weight} onChange={e => handleContainerChange(index, 'net_weight', e.target.value)} className='h-8 text-xs'/></TableCell>
                              <TableCell><Input value={c.m3} onChange={e => handleContainerChange(index, 'm3', e.target.value)} className='h-8 text-xs'/></TableCell>
                              <TableCell><Input value={c.vgm} onChange={e => handleContainerChange(index, 'vgm', e.target.value)} className='h-8 text-xs font-bold text-primary'/></TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" type="button" onClick={() => handleInputChange('containers', formData.containers.filter((_: any, i: number) => i !== index))}>
                                  <Trash2 className='h-4 w-4 text-destructive'/>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {formData.containers.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={9} className='text-center py-8 text-muted-foreground italic text-xs'>
                                Nenhum contêiner cadastrado. Importe uma planilha ou adicione manualmente.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <h3 className="text-md font-bold text-primary uppercase mb-4">Inspeção Física e Lacração</h3>
                    <div className="space-y-2 rounded-md border p-4 bg-muted/20">
                      {formData.containers.map((c: any, i: number) => (
                        <div key={c.id} className="flex items-center gap-4 p-2 border-b last:border-0">
                          <Checkbox checked={c.inspecionado} onCheckedChange={v => handleContainerChange(i, 'inspecionado', !!v)} />
                          <div className='flex-1 flex flex-col'>
                            <Label className="font-bold text-xs">{c.numero || `CONTÊINER ${i + 1}`}</Label>
                            <span className='text-[10px] text-muted-foreground uppercase'>VGM: {c.vgm} {c.lacre_original && `| Lacre: ${c.lacre_original}`}</span>
                          </div>
                          {c.inspecionado && (
                            <div className='flex items-center gap-2'>
                              <span className='text-[10px] font-bold text-muted-foreground uppercase'>NOVO LACRE:</span>
                              <Input value={c.novo_lacre || ''} onChange={e => handleContainerChange(i, 'novo_lacre', e.target.value)} placeholder="Novo Lacre MAPA/Senior" className="h-8 w-[180px] text-xs" />
                            </div>
                          )}
                        </div>
                      ))}
                      {formData.containers.length === 0 && <p className='text-xs text-muted-foreground text-center py-4'>Aguardando cadastro de contêineres para inspeção.</p>}
                    </div>
                </div>
              </CardContent></Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" disabled={!isEditing}>
            <AccordionTrigger><div className='flex items-center gap-3'>{getStepStatusIcon(4)}<h3 className="text-lg font-semibold text-left">Etapa 4: Confirmação de Embarque</h3></div></AccordionTrigger>
            <AccordionContent>
              <Card><CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                <div className="space-y-2"><Label>Navio Confirmado (Pode ser alterado aqui)</Label><Input value={formData.navio || ''} onChange={e => handleInputChange('navio', e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2"><Label>ETD</Label><DatePicker date={formData.etd} onDateChange={d => handleInputChange('etd', d)} showTime /></div>
                    <div className="space-y-2"><Label>ETA</Label><DatePicker date={formData.eta} onDateChange={d => handleInputChange('eta', d)} showTime /></div>
                </div>
              </CardContent></Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" disabled={!isEditing}>
            <AccordionTrigger><div className='flex items-center gap-3'>{getStepStatusIcon(5)}<h3 className="text-lg font-semibold text-left">Etapa 5: Pós-Embarque (Malote)</h3></div></AccordionTrigger>
            <AccordionContent>
              <Card><CardContent className="space-y-6 pt-6">
                <div className="flex justify-between items-center"><h3 className="font-bold text-primary">Documentos Originais</h3><Button variant="outline" size="sm" type="button" onClick={() => handleInputChange('documentos_pos_embarque', [...formData.documentos_pos_embarque, { id: Date.now(), nome: '', originais: 1, copias: 1, file: null }])}><PlusCircle className="mr-2 h-4 w-4" />Adicionar</Button></div>
                <Table><TableHeader><TableRow><TableHead>Documento</TableHead><TableHead>Originais</TableHead><TableHead>Cópias</TableHead><TableHead>Anexo</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>{formData.documentos_pos_embarque.map((d: any) => (
                  <TableRow key={d.id}>
                    <TableCell><Select value={d.nome} onValueChange={v => handlePostShipmentDocChange(d.id, 'nome', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{documentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></TableCell>
                    <TableCell><Input type="number" className="w-20" value={d.originais} onChange={e => handlePostShipmentDocChange(d.id, 'originais', e.target.value)} /></TableCell>
                    <TableCell><Input type="number" className="w-20" value={d.copias} onChange={e => handlePostShipmentDocChange(d.id, 'copias', e.target.value)} /></TableCell>
                    <TableCell><div className="flex items-center gap-2"><div className="flex-1 p-2 border rounded-md min-w-[120px] bg-muted overflow-hidden">{renderFileState(d.file)}</div>{d.file ? <Button variant="ghost" size="icon" type="button" onClick={() => removeFile({ type: 'documento_pos_embarque', id: d.id })}><Trash2 className="h-3 w-3" /></Button> : <Button variant="outline" size="icon" type="button" onClick={() => triggerFileUpload({ type: 'documento_pos_embarque', id: d.id })}><Upload className="h-3 w-3" /></Button>}</div></TableCell>
                    <TableCell><Button variant="ghost" size="icon" type="button" onClick={() => handleInputChange('documentos_pos_embarque', formData.documentos_pos_embarque.filter((x: any) => x.id !== d.id))}><Trash2 className="h-3 w-3 text-destructive" /></Button></TableCell>
                  </TableRow>
                ))}</TableBody></Table>
                <div className="flex items-end gap-4 border-t pt-4"><div className="space-y-2 flex-1"><Label>AWB Courier (Rastreio DHL/etc)</Label><Input value={formData.awb_courier || ''} onChange={e => handleInputChange('awb_courier', e.target.value)} /></div><Button type="button" variant="outline" onClick={generateOriginalDocsPdf}><FileDown className="mr-2 h-4 w-4" />Gerar Malote PDF</Button></div>
              </CardContent></Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" disabled={!isEditing}>
            <AccordionTrigger><div className='flex items-center gap-3'>{getStepStatusIcon(6)}<h3 className="text-lg font-semibold text-left">Etapa 6: Finalização</h3></div></AccordionTrigger>
            <AccordionContent>
              <Card><CardContent className="pt-6 text-center space-y-4">
                <div className='bg-green-50 border border-green-100 p-6 rounded-lg'>
                  <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-4'/>
                  <h4 className='text-xl font-bold text-green-800'>Processo Pronto para Concluir</h4>
                  <p className="text-green-700 mt-2">O processo será marcado como "Concluído" e arquivado no histórico do cliente.</p>
                </div>
                <Button className="w-full h-14 text-lg font-bold" type="button" onClick={() => handleInputChange('status', 'Concluído')} variant="default"><CheckCircle className="mr-2 h-6 w-6" />FINALIZAR PROCESSO AGORA</Button>
              </CardContent></Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </div>
  );
}
