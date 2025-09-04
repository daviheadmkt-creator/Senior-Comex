
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

const initialDocuments = [
    { id: 'bl', name: 'Bill of Lading (B/L)', status: 'Aguardando Envio' },
    { id: 'invoice', name: 'Commercial Invoice', status: 'Aguardando Envio' },
    { id: 'packing', name: 'Packing List', status: 'Aguardando Envio' },
    { id: 'co', name: 'Certificado de Origem', status: 'Aguardando Envio' },
]

const initialOriginalDocs = [
    { id: 'bl_original', name: 'Coletar Bill of Lading (B/L) Original', done: false },
    { id: 'coo_original', name: 'Emitir Certificado de Origem (COO) Original', done: false },
    { id: 'fito_original', name: 'Emitir Certificado Fitossanitário (FITO) Original', done: false },
    { id: 'pagamento_cert', name: 'Processar Pagamento de Certificados', done: false, isSubtask: true },
]


export default function NovoProcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: null,
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

  const [produtos, setProdutos] = useState<any[]>([]);
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [portos, setPortos] = useState<any[]>([]);

  const isEditing = searchParams.has('edit');
  const processId = searchParams.get('id');

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProdutos(storedProducts);

    const storedPartners = JSON.parse(localStorage.getItem('partners') || '[]');
    setParceiros(storedPartners);
    
    const storedPorts = JSON.parse(localStorage.getItem('ports') || '[]');
    setPortos(storedPorts);

    if (isEditing && processId) {
        const storedProcessos = JSON.parse(localStorage.getItem('processos') || '[]');
        const existingProcess = storedProcessos.find((p: any) => p.id === Number(processId));
        if (existingProcess) {
            setFormData({
                ...formData, // Start with default values
                ...existingProcess,
                documentos: existingProcess.documentos || initialDocuments,
                containers: existingProcess.containers || [],
                documentos_originais: existingProcess.documentos_originais || initialOriginalDocs,
            });
        }
    }
  }, [isEditing, processId]);


  const pageTitle = isEditing ? `Editar Processo ${formData.po_number || ''}` : 'Novo Processo (Nomeação)';
  const pageDescription = isEditing
    ? 'Gerencie todas as etapas do processo de exportação.'
    : 'Inicie um novo processo a partir de uma nomeação.';

  const handleInputChange = (id: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleContainerChange = (index: number, field: string, value: string | boolean) => {
    const updatedContainers = [...formData.containers];
    (updatedContainers[index] as any)[field] = value;
    setFormData(prev => ({...prev, containers: updatedContainers}));
  };
  
  const handleOriginalDocChange = (docId: string, checked: boolean) => {
    const updatedDocs = formData.documentos_originais.map(doc => 
        doc.id === docId ? {...doc, done: checked} : doc
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


  const handleDocumentStatusChange = (docId: string, newStatus: string) => {
    setFormData(prev => ({
        ...prev,
        documentos: prev.documentos.map(doc => doc.id === docId ? {...doc, status: newStatus} : doc)
    }));
    toast({ title: `Status do documento "${docId.toUpperCase()}" atualizado para ${newStatus}!` });
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Aprovado':
            return 'default';
        case 'Em Análise':
            return 'secondary';
        case 'Rejeitado':
            return 'destructive';
        default:
            return 'outline';
    }
  }

  const getStepStatusIcon = (step: number) => {
        const { status, booking_number, documentos, due_status, mapa_status, bl_master, documentos_originais, awb_courier } = formData;
        const allDocsApproved = documentos.every(d => d.status === 'Aprovado');
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
                if (bl_master) return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (mapa_status === 'Deferido') return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
                return <XCircle className="h-5 w-5 text-gray-400" />;
            case 7: // Docs Originais
                if (allOriginalDocsDone) return <CheckCircle className="h-5 w-5 text-green-500" />;
                if (bl_master) return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
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
    
    if (isEditing) {
        // Update existing process
        const updatedProcessos = storedProcessos.map((p: any) => {
            if (p.id === formData.id) {
                const selectedProduct = produtos.find(prod => String(prod.id) === String(formData.produtoId));
                const selectedExporter = parceiros.find(part => String(part.id) === String(formData.exportadorId));
                const selectedPortoDescarga = portos.find(port => String(port.id) === String(formData.portoDescargaId));
                return { 
                    ...p, // keep old values if not present in formData
                    ...formData,
                    produtoNome: selectedProduct?.descricao || p.produtoNome,
                    exportadorNome: selectedExporter?.nome_fantasia || p.exportadorNome,
                    destino: selectedPortoDescarga?.name || p.destino,
                };
            }
            return p;
        });
        localStorage.setItem('processos', JSON.stringify(updatedProcessos));
        toast({
            title: "Sucesso!",
            description: "Processo atualizado.",
            variant: "default",
        });

    } else {
        // Create new process
        const newId = storedProcessos.length > 0 ? Math.max(...storedProcessos.map((p: any) => p.id)) + 1 : 1;
        
        const selectedProduct = produtos.find(p => String(p.id) === formData.produtoId);
        const selectedExporter = parceiros.find(p => String(p.id) === formData.exportadorId);
        const selectedPortoDescarga = portos.find(p => String(p.id) === formData.portoDescargaId);

        const newProcesso = {
          ...formData,
          id: newId,
          produtoNome: selectedProduct?.descricao || 'N/A',
          exportadorNome: selectedExporter?.nome_fantasia || 'N/A',
          destino: selectedPortoDescarga?.name || 'N/A',
          documentos: initialDocuments,
          containers: [],
          documentos_originais: initialOriginalDocs,
        };

        const updatedProcessos = [...storedProcessos, newProcesso];
        localStorage.setItem('processos', JSON.stringify(updatedProcessos));
        
        toast({
            title: "Sucesso!",
            description: "Novo processo criado a partir da nomeação.",
            variant: "default",
        });
    }

    if (!isEditing) {
        router.push('/dashboard/processos');
    }
  };

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
                                <DatePicker />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                           
                            <div className="space-y-2">
                                <Label htmlFor="produtoId">Produto</Label>
                                <Select value={String(formData.produtoId || '')} onValueChange={value => handleInputChange('produtoId', value)}>
                                <SelectTrigger id="produtoId">
                                    <SelectValue placeholder="Selecione o produto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {produtos.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.descricao}</SelectItem>)}
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
                            <Select value={String(formData.exportadorId || '')} onValueChange={value => handleInputChange('exportadorId', value)}>
                            <SelectTrigger id="exportadorId">
                                <SelectValue placeholder="Selecione o exportador" />
                            </SelectTrigger>
                            <SelectContent>
                                {parceiros.filter(p => p.tipo_parceiro === 'Exportador').map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nome_fantasia}</SelectItem>)}
                            </SelectContent>
                            </Select>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="terminalEstufagemId">Terminal de Estufagem</Label>
                            <Select value={String(formData.terminalEstufagemId || '')} onValueChange={value => handleInputChange('terminalEstufagemId', value)}>
                            <SelectTrigger id="terminalEstufagemId">
                                <SelectValue placeholder="Selecione o terminal" />
                            </SelectTrigger>
                            <SelectContent>
                                {parceiros.filter(p => p.tipo_parceiro === 'Terminal de Estufagem').map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nome_fantasia}</SelectItem>)}
                            </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portoEmbarqueId">Porto de Embarque</Label>
                            <Select value={String(formData.portoEmbarqueId || '')} onValueChange={value => handleInputChange('portoEmbarqueId', value)}>
                            <SelectTrigger id="portoEmbarqueId">
                                <SelectValue placeholder="Selecione o porto" />
                            </SelectTrigger>
                            <SelectContent>
                                {portos.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                            </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portoDescargaId">Porto de Descarga</Label>
                            <Select value={String(formData.portoDescargaId || '')} onValueChange={value => handleInputChange('portoDescargaId', value)}>
                            <SelectTrigger id="portoDescargaId">
                                <SelectValue placeholder="Selecione o porto" />
                            </SelectTrigger>
                            <SelectContent>
                                {portos.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
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
                                        <SelectValue placeholder="Selecione o armador" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {parceiros.filter(p => p.tipo_parceiro === 'Armador').map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nome_fantasia}</SelectItem>)}
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
                                <DatePicker />
                            </div>
                            <div className="space-y-2">
                                <Label>Previsão de Chegada (ETA)</Label>
                                <DatePicker />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Deadline Draft</Label>
                                <DatePicker />
                            </div>
                            <div className="space-y-2">
                                <Label>Deadline VGM</Label>
                                <DatePicker />
                            </div>
                            <div className="space-y-2">
                                <Label>Deadline Carga</Label>
                                <DatePicker />
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
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Documento</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {formData.documentos.map(doc => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{doc.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(doc.status)}>{doc.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className='flex gap-2 justify-end'>
                                                <Button size="sm" variant="outline" type="button" onClick={() => handleDocumentStatusChange(doc.id, 'Em Análise')}>
                                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                                </Button>
                                                <Button size="sm" variant="outline" type="button" className="text-red-600 hover:text-red-700" onClick={() => handleDocumentStatusChange(doc.id, 'Rejeitado')}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Reprovar
                                                </Button>
                                                <Button size="sm" variant="outline" type="button" className="text-green-600 hover:text-green-700" onClick={() => handleDocumentStatusChange(doc.id, 'Aprovado')}>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Aprovar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                        <h3 className="text-lg font-semibold">Etapa 6: Confirmação de Embarque e Transição</h3>
                        <p className='text-sm text-muted-foreground'>Registre os dados finais para iniciar a fase de pós-embarque.</p>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bl_master">Nº do B/L Master</Label>
                                <Input id="bl_master" value={formData.bl_master || ''} onChange={e => handleInputChange('bl_master', e.target.value)} placeholder="Ex: MEDUHI295369" />
                            </div>
                            <div className="space-y-2">
                                <Label>Data de Embarque (Shipped on Board)</Label>
                                <DatePicker />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="navio_final">Navio Final (se aplicável)</Label>
                                <Input id="navio_final" value={formData.navio_final || ''} onChange={e => handleInputChange('navio_final', e.target.value)} placeholder="Confirme ou corrija o navio" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="viagem_final">Viagem Final (se aplicável)</Label>
                                <Input id="viagem_final" value={formData.viagem_final || ''} onChange={e => handleInputChange('viagem_final', e.target.value)} placeholder="Confirme ou corrija a viagem" />
                            </div>
                        </div>
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
                                    <div key={doc.id} className={`flex items-center gap-4 ${doc.isSubtask ? 'pl-6' : ''}`}>
                                        <Checkbox
                                            id={doc.id}
                                            checked={doc.done}
                                            onCheckedChange={(checked) => handleOriginalDocChange(doc.id, !!checked)}
                                        />
                                        <Label htmlFor={doc.id} className="font-normal text-sm">{doc.name}</Label>
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
