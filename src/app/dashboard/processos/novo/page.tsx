

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
import { ArrowLeft, CheckCircle, Upload, XCircle, PlusCircle, Trash2, FileDown, Loader2 } from 'lucide-react';
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

const initialDocuments: any[] = [];

const initialOriginalDocs = [
    { id: 'bl_original', name: 'Coletar Bill of Lading (B/L) Original', done: false, isSubtask: false, completionDate: null },
    { id: 'coo_original', name: 'Emitir Certificado de Origem (COO) Original', done: false, isSubtask: false, completionDate: null },
    { id: 'fito_original', name: 'Emitir Certificado Fitossanitário (FITO) Original', done: false, isSubtask: false, completionDate: null },
    { id: 'pagamento_cert', name: 'Processar Pagamento de Certificados', done: false, isSubtask: true, completionDate: null },
]

export default function NovoProcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Static data as a fallback
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [portos, setPortos] = useState<any[]>([]);
  const [terminais, setTerminais] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<any>({
    id: '',
    processo_interno: '',
    data_nomeacao: '',
    po_number: '',
    produtoId: '',
    quantidade: '',
    exportadorId: '',
    terminalEstufagemId: '',
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
    bl_master: '',
    navio_final: '',
    viagem_final: '',
    documentos_originais: initialOriginalDocs,
    awb_courier: '',
  });

  const [filteredTerminais, setFilteredTerminais] = useState<any[]>([]);

  const isEditing = searchParams.has('edit');
  const processId = searchParams.get('id');
  
  useEffect(() => {
    // Load reference data from localStorage
    try {
      const storedPartners = localStorage.getItem('partners');
      if (storedPartners) setParceiros(JSON.parse(storedPartners));
      
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) setProdutos(JSON.parse(storedProducts));

      const storedPorts = localStorage.getItem('ports');
      if (storedPorts) setPortos(JSON.parse(storedPorts));
      
      const storedTerminals = localStorage.getItem('terminals');
      if (storedTerminals) setTerminais(JSON.parse(storedTerminals));

      if (isEditing && processId) {
        const storedProcessos = localStorage.getItem('processos');
        if (storedProcessos) {
          const allProcessos = JSON.parse(storedProcessos);
          const processoData = allProcessos.find((p: any) => p.id === processId);
          if (processoData) {
            setFormData({
                ...processoData,
                documentos: processoData.documentos || initialDocuments,
                containers: processoData.containers || [],
                bls: processoData.bls || [],
                documentos_originais: processoData.documentos_originais || initialOriginalDocs,
            });
            if (processoData.portoEmbarqueId && storedTerminals) {
                const allTerminals = JSON.parse(storedTerminals);
                const filtered = allTerminals.filter((t: any) => String(t.portoId) === String(processoData.portoEmbarqueId));
                setFilteredTerminais(filtered);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, [isEditing, processId]);


  const pageTitle = isEditing ? `Editar Processo ${formData.processo_interno || ''}` : 'Novo Processo (Nomeação)';
  const pageDescription = isEditing
    ? 'Gerencie todas as etapas do processo de exportação.'
    : 'Inicie um novo processo a partir de uma nomeação.';

  const handleInputChange = (id: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePortChange = (value: string) => {
    handleInputChange('portoEmbarqueId', value);
    const filtered = terminais.filter(t => String(t.portoId) === value);
    setFilteredTerminais(filtered);
    handleInputChange('terminalEstufagemId', null); // Reset terminal selection
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
        containers: [...prev.containers, { id: Date.now(), numero: '', lacre: '', vgm: '', inspecionado: false, novo_lacre: '' }]
    }));
  };

  const removeContainer = (index: number) => {
    const updatedContainers = formData.containers.filter((_, i) => i !== index);
    setFormData(prev => ({...prev, containers: updatedContainers}));
  };
  
  const addBl = () => {
    setFormData(prev => ({
        ...prev,
        bls: [...prev.bls, { id: Date.now(), numero: '', data: '', data_liberacao: '', data_retirada: '', quantidade: '' }]
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
        const { status, booking_number, documentos, due_status, mapa_status, bl_master, documentos_originais, awb_courier } = formData;
        const allDocsApproved = documentos.length > 0 && documentos.every(d => d.status === 'Aprovado');
        const allOriginalDocsDone = documentos_originais.every(d => d.done);

        switch (step) {
            case 1: // Nomeação
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 2: // Booking
                if (booking_number) return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (status === 'Iniciado / Aguardando Booking') return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                return <XCircle className="h-5 w-5 text-gray-400" />;
            case 3: // Drafts
                if (status === 'CORRECAO_DE_DRAFT_SOLICITADA') return <XCircle className="h-5 w-5 text-red-500" />;
                if (allDocsApproved) return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (status.includes('DRAFT')) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                if (booking_number) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                return <XCircle className="h-5 w-5 text-gray-400" />;
            case 4: // Liberação Fiscal
                if (due_status === 'Desembaraçada') return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (allDocsApproved) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                return <XCircle className="h-5 w-5 text-gray-400" />;
            case 5: // Inspeção MAPA
                if (mapa_status === 'Indeferido') return <XCircle className="h-5 w-5 text-red-500" />;
                if (mapa_status === 'Deferido') return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (due_status === 'Desembaraçada') return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                 return <XCircle className="h-5 w-5 text-gray-400" />;
            case 6: // Embarque
                if (formData.bls.length > 0 && formData.bls.every(bl => bl.numero)) return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (mapa_status === 'Deferido') return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                return <XCircle className="h-5 w-5 text-gray-400" />;
            case 7: // Docs Originais
                if (allOriginalDocsDone) return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (formData.bls.length > 0) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                 return <XCircle className="h-5 w-5 text-gray-400" />;
            case 8: // Encerramento
                if (awb_courier) return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (allOriginalDocsDone) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                return <XCircle className="h-5 w-5 text-gray-400" />;
            default:
                return null;
        }
    };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const storedProcessos = JSON.parse(localStorage.getItem('processos') || '[]');
    
    // Get names for relations before saving
    const selectedProduct = produtos.find(p => String(p.id) === String(formData.produtoId));
    const selectedExporter = parceiros?.find(p => String(p.id) === String(formData.exportadorId));
    const selectedPortoDescarga = portos.find(p => String(p.id) === String(formData.portoDescargaId));

    const dataToSave = {
        ...formData,
        produtoNome: selectedProduct?.descricao || formData.produtoNome || 'N/A',
        exportadorNome: selectedExporter?.nome_fantasia || formData.exportadorNome || 'N/A',
        destino: selectedPortoDescarga?.name || formData.destino || 'N/A',
    };
    
    if (isEditing) {
        const index = storedProcessos.findIndex((p: any) => p.id === processId);
        if (index > -1) {
            storedProcessos[index] = dataToSave;
        }
    } else {
        dataToSave.id = Date.now().toString(); // Simple ID for localStorage
        storedProcessos.push(dataToSave);
    }

    localStorage.setItem('processos', JSON.stringify(storedProcessos));
    
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
                        <h3 className="text-lg font-semibold">Etapa 1: Nomeação do Processo</h3>
                        <p className='text-sm text-muted-foreground'>Dados iniciais recebidos para começar o processo de exportação.</p>
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
                                <Label htmlFor="produtoId">Produto</Label>
                                <Select value={String(formData.produtoId || '')} onValueChange={value => handleInputChange('produtoId', value)}>
                                <SelectTrigger id="produtoId">
                                    <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o produto"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {produtos?.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.descricao}</SelectItem>)}
                                </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="quantidade">Quantidade</Label>
                                <Input id="quantidade" value={formData.quantidade || ''} onChange={e => handleInputChange('quantidade', e.target.value)} placeholder="Ex: 270,00000 TON" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exportadorId">Unidade Carregadora (Exportador)</Label>
                            <Select value={formData.exportadorId} onValueChange={(value) => handleInputChange('exportadorId', value)}>
                                <SelectTrigger id="exportadorId">
                                    <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o exportador"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {parceiros?.filter(p => p.tipo_parceiro === 'Exportador').map(p => <SelectItem key={p.id} value={p.id}>{p.nome_fantasia}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
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
                            <Label htmlFor="terminalEstufagemId">Terminal de Estufagem</Label>
                             <Select value={String(formData.terminalEstufagemId || '')} onValueChange={value => handleInputChange('terminalEstufagemId', value)} disabled={!formData.portoEmbarqueId}>
                                <SelectTrigger id="terminalEstufagemId">
                                    <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o terminal"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredTerminais.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
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
                    </CardContent>
                </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Etapa 2 */}
          <AccordionItem value="item-2" disabled={!isEditing}>
             <AccordionTrigger>
                <div className='flex items-center gap-3'>
                    {getStepStatusIcon(2)}
                    <div className='text-left'>
                        <h3 className="text-lg font-semibold">Etapa 2: Confirmação de Booking</h3>
                        <p className='text-sm text-muted-foreground'>Dados da reserva de praça confirmada pelo armador.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="grid gap-6 pt-6">
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
          
           {/* Etapa 3 */}
          <AccordionItem value="item-3" disabled={!isEditing}>
             <AccordionTrigger>
                 <div className='flex items-center gap-3'>
                    {getStepStatusIcon(3)}
                    <div className='text-left'>
                        <h3 className="text-lg font-semibold">Etapa 3: Gestão de Documentos (Drafts)</h3>
                        <p className='text-sm text-muted-foreground'>Upload e controle da aprovação dos documentos de embarque.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardHeader>
                        <div className='flex justify-between items-center'>
                            <CardTitle className='text-base'>Lista de Documentos</CardTitle>
                            <Button size="sm" variant="outline" type="button" onClick={addDocument}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Documento
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-[30%]'>Nome do Documento</TableHead>
                                    <TableHead>Data do Status</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Anexo</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {formData.documentos.map((doc, index) => (
                                    <TableRow key={doc.id}>
                                        <TableCell><Input value={doc.name || ''} onChange={e => handleDocumentChange(index, 'name', e.target.value)} placeholder="Ex: Bill of Lading" /></TableCell>
                                        <TableCell>{doc.date || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(doc.status)}>{doc.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                             <Button size="sm" variant="outline" type="button">
                                                <Upload className="mr-2 h-4 w-4" /> Anexar
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className='flex gap-1 justify-end'>
                                                <Button size="icon" variant="ghost" type="button" className="text-red-600 hover:text-red-700" onClick={() => handleDocumentStatusChange(index, 'Rejeitado')} title="Rejeitar">
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" type="button" className="text-green-600 hover:text-green-700" onClick={() => handleDocumentStatusChange(index, 'Aprovado')} title="Aprovar">
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" type="button" onClick={() => removeDocument(index)} title="Remover">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {formData.documentos.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">Nenhum documento adicionado.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </AccordionContent>
          </AccordionItem>

           {/* Etapa 4 */}
          <AccordionItem value="item-4" disabled={!isEditing}>
             <AccordionTrigger>
                 <div className='flex items-center gap-3'>
                    {getStepStatusIcon(4)}
                    <div className='text-left'>
                        <h3 className="text-lg font-semibold">Etapa 4: Liberação Física e Fiscal na Origem</h3>
                        <p className='text-sm text-muted-foreground'>Gerencie as notas fiscais, contêineres e o desembaraço aduaneiro.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="space-y-6 pt-6">
                        <div className='grid md:grid-cols-3 gap-4'>
                            <div className="space-y-2">
                                <Label htmlFor="nf_remessa">NFs de Remessa</Label>
                                <Input id="nf_remessa" value={formData.nf_remessa || ''} onChange={e => handleInputChange('nf_remessa', e.target.value)} placeholder="Ex: 14575, 14579" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nf_retorno">NF de Retorno (Estufagem)</Label>
                                <Input id="nf_retorno" value={formData.nf_retorno || ''} onChange={e => handleInputChange('nf_retorno', e.target.value)} placeholder="Ex: 16109" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nf_exportacao">NF de Exportação (NF-e)</Label>
                                <Input id="nf_exportacao" value={formData.nf_exportacao || ''} onChange={e => handleInputChange('nf_exportacao', e.target.value)} placeholder="Insira o nº da NF-e" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-medium">Dados dos Contêineres</h3>
                                <Button type="button" variant="outline" size="sm" onClick={addContainer}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Adicionar Contêiner
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nº do Contêiner</TableHead>
                                        <TableHead>Nº do Lacre</TableHead>
                                        <TableHead>VGM (kg)</TableHead>
                                        <TableHead>Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {formData.containers.map((container, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Input value={container.numero || ''} onChange={e => handleContainerChange(index, 'numero', e.target.value)} placeholder="Ex: MSCU1234567" /></TableCell>
                                            <TableCell><Input value={container.lacre || ''} onChange={e => handleContainerChange(index, 'lacre', e.target.value)} placeholder="Ex: SEAL123" /></TableCell>
                                            <TableCell><Input value={container.vgm || ''} type="number" onChange={e => handleContainerChange(index, 'vgm', e.target.value)} placeholder="Ex: 25000" /></TableCell>
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
                    </CardContent>
                </Card>
            </AccordionContent>
          </AccordionItem>
          
           {/* Etapa 5 */}
          <AccordionItem value="item-5" disabled={!isEditing}>
             <AccordionTrigger>
                 <div className='flex items-center gap-3'>
                    {getStepStatusIcon(5)}
                    <div className='text-left'>
                        <h3 className="text-lg font-semibold">Etapa 5: Gestão da Inspeção Final (MAPA)</h3>
                        <p className='text-sm text-muted-foreground'>Gerencie a inspeção do MAPA e a liberação final para embarque.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="space-y-6 pt-6">
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
          
           {/* Etapa 6 */}
            <AccordionItem value="item-6" disabled={!isEditing}>
                <AccordionTrigger>
                    <div className='flex items-center gap-3'>
                        {getStepStatusIcon(6)}
                        <div className='text-left'>
                            <h3 className="text-lg font-semibold">Etapa 6: Confirmação de Embarque (BLs)</h3>
                            <p className='text-sm text-muted-foreground'>Gerencie os detalhes dos Conhecimentos de Embarque (Bills of Lading).</p>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base">Dados do B/L</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={addBl}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Adicionar BL
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.bls.map((bl, index) => (
                                <Card key={bl.id} className="bg-muted/40">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardDescription>BL #{index + 1}</CardDescription>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeBl(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`bl_numero_${bl.id}`}>Número do BL</Label>
                                            <Input id={`bl_numero_${bl.id}`} value={bl.numero || ''} onChange={e => handleBlChange(index, 'numero', e.target.value)} placeholder="Ex: MEDUHI295369" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`bl_quantidade_${bl.id}`}>Quantidade no BL</Label>
                                            <Input id={`bl_quantidade_${bl.id}`} value={bl.quantidade || ''} onChange={e => handleBlChange(index, 'quantidade', e.target.value)} placeholder="Ex: 135,00000 TON" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Data do BL</Label>
                                            <DatePicker />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Data de Liberação do BL</Label>
                                            <DatePicker />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Data de Retirada do BL da Agência</Label>
                                            <DatePicker />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {formData.bls.length === 0 && (
                                <div className="text-center text-muted-foreground py-4">Nenhum BL adicionado.</div>
                            )}
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>

           {/* Etapa 7 */}
          <AccordionItem value="item-7" disabled={!isEditing}>
             <AccordionTrigger>
                 <div className='flex items-center gap-3'>
                    {getStepStatusIcon(7)}
                    <div className='text-left'>
                        <h3 className="text-lg font-semibold">Etapa 7: Obtenção dos Documentos Originais</h3>
                        <p className='text-sm text-muted-foreground'>Gerencie a coleta e o envio dos documentos de pós-embarque.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="space-y-6 pt-6">
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
                            <Button type="button" variant="outline">
                                <FileDown className="mr-2 h-4 w-4" />
                                Gerar Pacote PDF
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </AccordionContent>
          </AccordionItem>
          
           {/* Etapa 8 */}
          <AccordionItem value="item-8" disabled={!isEditing}>
             <AccordionTrigger>
                 <div className='flex items-center gap-3'>
                    {getStepStatusIcon(8)}
                    <div className='text-left'>
                        <h3 className="text-lg font-semibold">Etapa 8: Envio dos Documentos e Encerramento</h3>
                        <p className='text-sm text-muted-foreground'>Conclua o processo e arquive todo o histórico.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="space-y-6 pt-6">
                       <div className='text-center py-4'>
                         <p className='text-lg font-semibold'>Processo pronto para ser finalizado.</p>
                         <p className='text-muted-foreground'>Verifique se o AWB do courier foi inserido na Etapa 7. Ao concluir, o status do processo será alterado para "Concluído" e sairá da lista de processos ativos.</p>
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
