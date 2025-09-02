
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
import { ArrowLeft, CheckCircle, Upload, XCircle, PlusCircle, Trash2 } from 'lucide-react';
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
    "Concluído",
    "Atrasado",
    "Cancelado",
]

const initialDocuments = [
    { id: 'bl', name: 'Bill of Lading (B/L)', status: 'Aguardando Envio' },
    { id: 'invoice', name: 'Commercial Invoice', status: 'Aguardando Envio' },
    { id: 'packing', name: 'Packing List', status: 'Aguardando Envio' },
    { id: 'co', name: 'Certificado de Origem', status: 'Aguardando Envio' },
]

const initialContainers = [
    { id: 1, numero: 'MSCU1234567', lacre: 'SEAL123', vgm: '25000', inspecionado: false, novo_lacre: '' }
]

export default function NovoProcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: null,
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
  });

  const [produtos, setProdutos] = useState<any[]>([]);
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [portos, setPortos] = useState<any[]>([]);

  const isEditing = searchParams.has('edit');
  const processId = searchParams.get('id');

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) setProdutos(JSON.parse(storedProducts));

    const storedPartners = localStorage.getItem('partners');
    if (storedPartners) setParceiros(JSON.parse(storedPartners));
    
    const storedPorts = localStorage.getItem('ports');
    if (storedPorts) setPortos(JSON.parse(storedPorts));

    if (isEditing && processId) {
        const storedProcessos = JSON.parse(localStorage.getItem('processos') || '[]');
        const existingProcess = storedProcessos.find((p: any) => p.id === Number(processId));
        if (existingProcess) {
            setFormData({
                ...formData, // Start with default values
                ...existingProcess,
                documentos: existingProcess.documentos || initialDocuments,
                containers: existingProcess.containers || [],
            });
        }
    }
  }, [isEditing, processId]);


  const pageTitle = isEditing ? 'Editar Processo' : 'Novo Processo (Nomeação)';
  const pageDescription = isEditing
    ? 'Altere as informações do processo selecionado.'
    : 'Inicie um novo processo a partir de uma nomeação.';

  const handleInputChange = (id: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleContainerChange = (index: number, field: string, value: string | boolean) => {
    const updatedContainers = [...formData.containers];
    (updatedContainers[index] as any)[field] = value;
    setFormData(prev => ({...prev, containers: updatedContainers}));
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
          id: newId,
          ...formData,
          produtoNome: selectedProduct?.descricao || 'N/A',
          exportadorNome: selectedExporter?.nome_fantasia || 'N/A',
          destino: selectedPortoDescarga?.name || 'N/A',
          documentos: initialDocuments,
          containers: [],
        };

        const updatedProcessos = [...storedProcessos, newProcesso];
        localStorage.setItem('processos', JSON.stringify(updatedProcessos));
        
        toast({
            title: "Sucesso!",
            description: "Novo processo criado a partir da nomeação.",
            variant: "default",
        });
    }

    router.push('/dashboard/processos');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
            <CardHeader>
            <div className="flex justify-between items-center">
                <div className='flex items-center gap-4'>
                <Link href="/dashboard/processos" passHref>
                    <Button variant="outline" size="icon" type="button">
                    <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <CardTitle>{pageTitle}</CardTitle>
                    <CardDescription>{pageDescription}</CardDescription>
                </div>
                </div>
            </div>
            </CardHeader>
            <CardContent className="grid gap-6">
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
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="po_number">Nº do Contrato/PO</Label>
                        <Input id="po_number" value={formData.po_number || ''} onChange={e => handleInputChange('po_number', e.target.value)} placeholder="Ex: 3426B" />
                    </div>
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
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input id="quantidade" value={formData.quantidade || ''} onChange={e => handleInputChange('quantidade', e.target.value)} placeholder="Ex: 270,00000 TON" />
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

        {isEditing && (
            <>
             <Card>
                <CardHeader>
                    <CardTitle>Etapa 2: Confirmação de Booking</CardTitle>
                    <CardDescription>Insira os dados da reserva de praça confirmada pelo armador.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
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
             <Card>
                <CardHeader>
                    <CardTitle>Etapa 3: Gestão de Documentos (Drafts)</CardTitle>
                    <CardDescription>Faça o upload e controle a aprovação dos documentos de embarque.</CardDescription>
                </CardHeader>
                <CardContent>
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
             <Card>
                <CardHeader>
                    <CardTitle>Etapa 4: Liberação Física e Fiscal na Origem</CardTitle>
                    <CardDescription>Gerencie as notas fiscais, contêineres e o desembaraço aduaneiro.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                                        <TableCell><Input value={container.numero} onChange={e => handleContainerChange(index, 'numero', e.target.value)} placeholder="Ex: MSCU1234567" /></TableCell>
                                        <TableCell><Input value={container.lacre} onChange={e => handleContainerChange(index, 'lacre', e.target.value)} placeholder="Ex: SEAL123" /></TableCell>
                                        <TableCell><Input value={container.vgm} type="number" onChange={e => handleContainerChange(index, 'vgm', e.target.value)} placeholder="Ex: 25000" /></TableCell>
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
             <Card>
                <CardHeader>
                    <CardTitle>Etapa 5: Gestão da Inspeção Final (MAPA)</CardTitle>
                    <CardDescription>Gerencie a inspeção do MAPA e a liberação final para embarque.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                                        value={container.novo_lacre} 
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
              <Card>
                <CardHeader>
                    <CardTitle>Etapa 6: Confirmação de Embarque e Transição</CardTitle>
                    <CardDescription>Registre os dados finais do embarque para iniciar a fase de pós-embarque.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bl_master">Nº do B/L Master</Label>
                            <Input id="bl_master" value={formData.bl_master} onChange={e => handleInputChange('bl_master', e.target.value)} placeholder="Ex: MEDUHI295369" />
                        </div>
                        <div className="space-y-2">
                            <Label>Data de Embarque (Shipped on Board)</Label>
                            <DatePicker />
                        </div>
                    </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="navio_final">Navio Final (se aplicável)</Label>
                            <Input id="navio_final" value={formData.navio_final} onChange={e => handleInputChange('navio_final', e.target.value)} placeholder="Confirme ou corrija o navio" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="viagem_final">Viagem Final (se aplicável)</Label>
                            <Input id="viagem_final" value={formData.viagem_final} onChange={e => handleInputChange('viagem_final', e.target.value)} placeholder="Confirme ou corrija a viagem" />
                        </div>
                    </div>
                </CardContent>
             </Card>
            </>
        )}

        <div className="flex justify-end gap-2 pt-4">
            <Link href="/dashboard/processos" passHref>
            <Button variant="outline" type="button">Cancelar</Button>
            </Link>
            <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  );
}
