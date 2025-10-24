
'use client';

import { useState, useEffect } from 'react';
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
import { ArrowLeft, CheckCircle, Upload, XCircle, PlusCircle, Trash2, FileDown, Loader2, FileUp } from 'lucide-react';
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
    data_nomeacao: '',
    po_number: '',
    produtoId: '',
    quantidade: '',
    exportadorId: '',
    portoEmbarqueId: '',
    portoDescargaId: '',
    status: 'Iniciado / Aguardando Booking',
    booking_number: '',
    armadorId: '',
    navio: '',
    viagem: '',
    documentos: initialDocuments,
    containers: [] as any[],
    bls: [] as any[],
    nf_remessa: '',
    nf_retorno: '',
    nf_exportacao: '',
    due_numero: '',
    due_status: 'Não registrada',
    lpco_protocolo: '',
    mapa_status: 'Aguardando Análise',
    navio_final: '',
    viagem_final: '',
    documentos_originais: initialOriginalDocs,
    awb_courier: '',
    analistaId: '',
    draft_bl_shipper: '',
    draft_bl_consignee: '',
    draft_bl_notify: '',
    draft_bl_marks: '',
    draft_bl_port_loading: '',
    draft_bl_port_discharge: '',
    draft_bl_description: '',
  };

export default function NovoProcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const isEditing = searchParams.has('edit');
  const processId = searchParams.get('id');

  const [parceiros, setParceiros] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [portos, setPortos] = useState<any[]>([]);
  const [terminais, setTerminais] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<any>(initialFormData);

  const [filteredTerminais, setFilteredTerminais] = useState<any[]>([]);
  const [filteredAnalistas, setFilteredAnalistas] = useState<any[]>([]);

    useEffect(() => {
        try {
            const storedParceiros = JSON.parse(localStorage.getItem('partners') || '[]');
            const storedPortos = JSON.parse(localStorage.getItem('ports') || '[]');
            const storedTerminais = JSON.parse(localStorage.getItem('terminals') || '[]');
            const storedProcessos = JSON.parse(localStorage.getItem('processos') || '[]');
            const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
            
            setParceiros(storedParceiros);
            setPortos(storedPortos);
            setTerminais(storedTerminais);
            setUsuarios(storedUsers);
            
            const productsFromPartners = storedParceiros.filter((p: any) => p.tipo_parceiro === 'Produto');
            setProdutos(productsFromPartners);


            if (isEditing && processId) {
                const processoData = storedProcessos.find((p: any) => p.id === processId);
                if (processoData) {
                    setFormData({
                        ...initialFormData, 
                        ...processoData,
                        documentos: processoData.documentos || initialDocuments,
                        containers: processoData.containers || [],
                        bls: processoData.bls || [],
                        documentos_originais: processoData.documentos_originais || initialOriginalDocs,
                    });
                     if (processoData.portoEmbarqueId && storedTerminais) {
                        const filtered = storedTerminais.filter((t: any) => String(t.portoId) === String(processoData.portoEmbarqueId));
                        setFilteredTerminais(filtered);
                    }
                    if (processoData.exportadorId && storedParceiros) {
                        const exportador = storedParceiros.find(p => p.id === processoData.exportadorId);
                        setFilteredAnalistas(exportador?.contatos || []);
                    }
                }
            } else {
                const productsFromPartners = storedParceiros.filter((p: any) => p.tipo_parceiro === 'Produto');
                setProdutos(productsFromPartners);
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
            toast({
                title: "Erro ao Carregar Dados",
                description: "Não foi possível carregar dados do armazenamento local.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
  }, [isEditing, processId, toast]);
  

  const pageTitle = isEditing ? `Editar Processo ${formData.processo_interno || ''}` : 'Novo Processo (Nomeação)';
  const pageDescription = isEditing
    ? 'Gerencie todas as etapas do processo de exportação.'
    : 'Inicie um novo processo a partir de uma nomeação.';

  const handleInputChange = (id: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [id]: value ?? '' }));
  };
  
  const handleExportadorChange = (value: string) => {
    handleInputChange('exportadorId', value);
    const exportador = parceiros.find(p => p.id === value);
    setFilteredAnalistas(exportador?.contatos || []);
    handleInputChange('analistaId', null); // Reset analista selection
  }

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
  
  const handleBlChange = (index: number, field: string, value: string) => {
    const updatedBls = [...formData.bls];
    (updatedBls[index] as any)[field] = value;
    setFormData(prev => ({...prev, bls: updatedBls}));
  };

  const handleDocumentChange = (index: number, field: string, value: string) => {
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
        bls: [...prev.bls, { id: Date.now(), numero: '', tipo: 'BL', data_emissao: '', data_liberacao: '', data_retirada: '' }]
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

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
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
        const { status, booking_number, documentos, due_status, mapa_status, bls, documentos_originais, awb_courier } = formData;
        const allDocsApproved = documentos.length > 0 && documentos.every(d => d.status === 'Aprovado');
        const allOriginalDocsDone = documentos_originais.every(d => d.done);

        switch (step) {
            case 1: // Nomeação + Booking
                if (booking_number) return <CheckCircle className="h-5 w-5 text-green-500" />;
                 return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
            case 2: // Drafts
                if (status === 'CORRECAO_DE_DRAFT_SOLICITADA') return <XCircle className="h-5 w-5 text-red-500" />;
                if (allDocsApproved || status.includes('APROVADOS')) return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (status.includes('DRAFT')) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                if (booking_number) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                return <XCircle className="h-5 w-5 text-gray-400" />;
            case 3: // Liberação Fiscal e Inspeção
                if (due_status === 'Desembaraçada' && mapa_status === 'Deferido') return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (mapa_status === 'Indeferido') return <XCircle className="h-5 w-5 text-red-500" />;
                if (status.includes('APROVADOS')) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                return <XCircle className="h-5 w-5 text-gray-400" />;
            case 4: // Embarque
                if (bls && bls.length > 0 && bls.every(bl => bl.numero)) return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (due_status === 'Desembaraçada' && mapa_status === 'Deferido') return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
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

    const generatePdf = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text(`Pacote de Drafts - Processo: ${formData.processo_interno || 'N/A'}`, 14, 22);

        // Draft BL
        doc.setFontSize(14);
        doc.text('DRAFT - BILL OF LADING', 14, 40);
        (doc as any).autoTable({
            startY: 45,
            theme: 'grid',
            body: [
                ['Shipper', formData.draft_bl_shipper || ''],
                ['Consignee', formData.draft_bl_consignee || ''],
                ['Notify Party', formData.draft_bl_notify || ''],
                ['Port of Loading', formData.draft_bl_port_loading || ''],
                ['Port of Discharge', formData.draft_bl_port_discharge || ''],
                ['Marks and Numbers', formData.draft_bl_marks || ''],
                ['Description of Goods', formData.draft_bl_description || ''],
            ],
            styles: { fontSize: 10 },
        });

        const blTableHeight = (doc as any).lastAutoTable.finalY;

        // Draft Fito / COO
        doc.setFontSize(14);
        doc.text('DRAFT - Certificado Fitossanitário / de Origem', 14, blTableHeight + 15);
        doc.setFontSize(10);
        doc.text("Esta seção é um placeholder para os dados do Certificado Fitossanitário e de Origem.", 14, blTableHeight + 22);
        doc.text("Os campos para estes documentos serão adicionados em uma futura implementação.", 14, blTableHeight + 28);
        
        doc.save(`Drafts_${formData.processo_interno || 'processo'}.pdf`);

        toast({
            title: "PDF Gerado!",
            description: "O pacote de drafts foi gerado com sucesso.",
        });
    };

    const generateOriginalDocsPdf = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text(`Documentos Originais - Processo: ${formData.processo_interno || 'N/A'}`, 14, 22);

        doc.setFontSize(14);
        doc.text('Conhecimentos de Embarque (BLs)', 14, 40);
        const blBody = formData.bls.map(bl => [
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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const storedProcessos = JSON.parse(localStorage.getItem('processos') || '[]');
    const selectedProduct = produtos?.find(p => String(p.id) === String(formData.produtoId));
    const selectedExporter = parceiros?.find(p => String(p.id) === String(formData.exportadorId));
    const selectedPortoDescarga = portos?.find(p => String(p.id) === String(formData.portoDescargaId));

    if (isEditing) {
        const updatedProcessos = storedProcessos.map((p: any) => {
            if (p.id === processId) {
                return {
                    ...p,
                    ...formData,
                    produtoNome: selectedProduct?.nome_fantasia || formData.produtoNome || 'N/A',
                    exportadorNome: selectedExporter?.nome_fantasia || formData.exportadorNome || 'N/A',
                    destino: selectedPortoDescarga?.name || formData.destino || 'N/A',
                }
            }
            return p;
        });
        localStorage.setItem('processos', JSON.stringify(updatedProcessos));
    } else {
        const newId = String(Date.now());
         const newProcesso = {
            ...formData,
            id: newId,
            produtoNome: selectedProduct?.nome_fantasia || 'N/A',
            exportadorNome: selectedExporter?.nome_fantasia || 'N/A',
            destino: selectedPortoDescarga?.name || 'N/A',
        };
        const updatedProcessos = [...storedProcessos, newProcesso];
        localStorage.setItem('processos', JSON.stringify(updatedProcessos));
    }
    
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
        <div className="flex justify-between items-center">
            <div className='flex items-center gap-4'>
            <Link href="/dashboard/processos" passHref>
                <Button variant="outline" size="icon" type="button">
                <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
                <p className="text-muted-foreground">{pageDescription}</p>
            </div>
            </div>
             <div className="flex justify-end gap-2">
                <Link href="/dashboard/processos" passHref>
                    <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit">Salvar Alterações</Button>
            </div>
        </div>

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
                        <div className="space-y-2">
                            <Label htmlFor="status">Status Geral do Processo</Label>
                            <Select value={formData.status || ''} onValueChange={value => handleInputChange('status', value)}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {processStatusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         
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
                                <DatePicker showTime />
                            </div>
                        </div>

                         <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="exportadorId">Unidade Carregadora (Exportador)</Label>
                                <Select value={String(formData.exportadorId || '')} onValueChange={handleExportadorChange}>
                                    <SelectTrigger id="exportadorId">
                                        <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o exportador"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {parceiros?.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nome_fantasia}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="analistaId">Analista Responsável (Cliente)</Label>
                                <Select value={String(formData.analistaId || '')} onValueChange={value => handleInputChange('analistaId', value)} disabled={!formData.exportadorId}>
                                    <SelectTrigger id="analistaId">
                                        <SelectValue placeholder={!formData.exportadorId ? "Selecione um exportador primeiro" : "Selecione o analista"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredAnalistas.length > 0 ? (
                                            filteredAnalistas.map((contato, index) => <SelectItem key={`${contato.nome}-${index}`} value={contato.nome}>{contato.nome} ({contato.cargo})</SelectItem>)
                                        ) : (
                                            <div className="px-2 py-1.5 text-sm text-muted-foreground">Nenhum contato encontrado.</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                         </div>

                        <div className="grid md:grid-cols-2 gap-4">
                           
                            <div className="space-y-2">
                                <Label htmlFor="produtoId">Produto</Label>
                                <Select value={String(formData.produtoId || '')} onValueChange={value => handleInputChange('produtoId', value)}>
                                <SelectTrigger id="produtoId">
                                    <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o produto"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {produtos?.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nome_fantasia}</SelectItem>)}
                                </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="quantidade">Quantidade</Label>
                                <Input id="quantidade" value={formData.quantidade || ''} onChange={e => handleInputChange('quantidade', e.target.value)} placeholder="Ex: 270,00000 TON" />
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="portoEmbarqueId">Porto de Embarque</Label>
                            <Select value={String(formData.portoEmbarqueId || '')} onValueChange={handlePortChange}>
                                <SelectTrigger id="portoEmbarqueId">
                                    <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o porto"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {portos?.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portoDescargaId">Porto de Descarga</Label>
                            <Select value={String(formData.portoDescargaId || '')} onValueChange={value => handleInputChange('portoDescargaId', value)}>
                            <SelectTrigger id="portoDescargaId">
                                <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o porto"} />
                            </SelectTrigger>
                            <SelectContent>
                                {portos?.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                            </SelectContent>
                            </Select>
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
                                        <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o armador"} />
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
                                <DatePicker showTime />
                            </div>
                            <div className="space-y-2">
                                <Label>Previsão de Chegada (ETA)</Label>
                                <DatePicker showTime />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label>Deadline Draft</Label>
                                <div className="flex items-center gap-2">
                                <DatePicker showTime />
                                <Button variant="outline" size="icon" type="button" title="Anexar Comprovante">
                                    <Upload className="h-4 w-4" />
                                </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Deadline VGM</Label>
                                <div className="flex items-center gap-2">
                                <DatePicker showTime />
                                <Button variant="outline" size="icon" type="button" title="Anexar Comprovante">
                                    <Upload className="h-4 w-4" />
                                </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Deadline Carga</Label>
                                <div className="flex items-center gap-2">
                                <DatePicker showTime />
                                <Button variant="outline" size="icon" type="button" title="Anexar Comprovante">
                                    <Upload className="h-4 w-4" />
                                </Button>
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
                        <div className="p-4 border rounded-lg space-y-4">
                            <h4 className='font-medium'>Draft - Bill of Lading (BL)</h4>
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

                         <div className="p-4 border rounded-lg space-y-4 text-muted-foreground">
                            <h4 className='font-medium'>Draft - Certificado Fitossanitário / Origem (Em breve)</h4>
                            <p className='text-sm'>Os campos para geração dos drafts do Certificado Fitossanitário e de Origem estarão disponíveis em uma futura atualização.</p>
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
                        <div className='grid md:grid-cols-3 gap-4'>
                            <div className="space-y-2">
                                <Label htmlFor="nf_remessa">NFs de Remessa (Chave)</Label>
                                <div className="flex items-center gap-2">
                                    <Input id="nf_remessa" value={formData.nf_remessa || ''} onChange={e => handleInputChange('nf_remessa', e.target.value)} placeholder="Insira a chave de acesso..." />
                                    <Button type="button" variant="outline" size="icon"><FileUp className="h-4 w-4"/></Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nf_retorno">NF do Produtor</Label>
                                <div className="flex items-center gap-2">
                                    <Input id="nf_retorno" value={formData.nf_retorno || ''} onChange={e => handleInputChange('nf_retorno', e.target.value)} placeholder="Insira a chave de acesso..." />
                                    <Button type="button" variant="outline" size="icon"><FileUp className="h-4 w-4"/></Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nf_exportacao">NF de Exportação (Chave)</Label>
                                <div className="flex items-center gap-2">
                                    <Input id="nf_exportacao" value={formData.nf_exportacao || ''} onChange={e => handleInputChange('nf_exportacao', e.target.value)} placeholder="Insira a chave de acesso..." />
                                    <Button type="button" variant="outline" size="icon"><FileUp className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-medium">Dados dos Contêineres</h3>
                                <div className='flex items-center gap-2'>
                                    <Button type="button" variant="outline" size="sm">
                                        <FileUp className="mr-2 h-4 w-4" />
                                        Importar Planilha (XLSX)
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
                                        {formData.containers.map((container, index) => (
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
                                        <SelectItem value="Não registrada">Não registrada</SelectItem>
                                        <SelectItem value="Em análise">Em análise</SelectItem>
                                        <SelectItem value="Desembaraçada">Desembaraçada</SelectItem>
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
                                <Label htmlFor="mapa_status">Status da Inspeção MAPA</Label>
                                <Select value={formData.mapa_status || ''} onValueChange={value => handleInputChange('mapa_status', value)}>
                                    <SelectTrigger id="mapa_status">
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Aguardando Análise">Aguardando Análise</SelectItem>
                                        <SelectItem value="Inspeção Agendada">Inspeção Agendada</SelectItem>
                                        <SelectItem value="Inspeção Realizada">Inspeção Realizada</SelectItem>
                                        <SelectItem value="Deferido">Deferido (Liberado)</SelectItem>
                                        <SelectItem value="Indeferido">Indeferido (Rejeitado)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-md font-medium mb-2">Contêineres para Inspeção</h3>
                            <div className="space-y-2 rounded-md border p-4">
                            {formData.containers.map((container, index) => (
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
                                    <DatePicker showTime />
                                </div>
                                <div className="space-y-2">
                                    <Label>Data de Chegada (ETA)</Label>
                                    <DatePicker showTime />
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
                                    {formData.bls.map((bl, index) => (
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
                                            <TableCell><DatePicker/></TableCell>
                                            <TableCell><DatePicker/></TableCell>
                                            <TableCell><DatePicker/></TableCell>
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
                                {formData.documentos_originais.map((doc) => (
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
