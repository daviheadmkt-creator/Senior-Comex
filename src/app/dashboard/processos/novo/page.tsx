
'use client';

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
import { ArrowLeft, ClipboardCheck, FileText, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';


const clients = [
  { id: '1', nomeEmpresa: 'Agrícola Exemplo LTDA' },
  { id: '2', nomeEmpresa: 'Comércio de Grãos Brasil S.A.' },
  { id: '3', nomeEmpresa: 'Fazenda Sol Nascente' },
  { id: '4', nomeEmpresa: 'Produtores Associados' },
];

const products = [
  { id: '1', descricao: 'Soja em Grãos' },
  { id: '2', descricao: 'Milho em Grãos' },
  { id: '3', descricao: 'Feijão Carioca Tipo 1' },
  { id: '4', descricao: 'Gergelim Branco' },
];

const analistas = [
  { id: '1', nome: 'Ana Silva' },
  { id: '2', nome: 'Carlos Dias' },
  { id: '3', nome: 'Daniela Lima' },
];

const parceiros = [
    {id: '1', nome: 'Terminal TCP'},
    {id: '2', nome: 'Terminal Granelmar'},
    {id: '3', nome: 'Sérgio Despachos'},
    {id: '4', nome: 'ABC Transportes'},
]

const timelineEvents = [
    {date: '03/07/2024', event: 'Reserva feita no CMA CGM BUZIOS'},
    {date: '27/07/2024', event: 'Processo previsto'},
    {date: '31/07/2024', event: 'Carga embarcada'},
    {date: '08/09/2024', event: 'Previsão de chegada'},
]

const checklistItems = [
    { id: 'due', label: 'DUE Averbada' },
    { id: 'bl', label: 'BL (Bill of Lading) Anexado' },
    { id: 'invoice', label: 'Commercial Invoice Anexada' },
    { id: 'packing', label: 'Packing List Anexado' },
    { id: 'lpco', label: 'LPCO Liberado' },
]


export default function NovoProcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
      referencia: '',
      po_number: '',
      cliente: '',
      produto: '',
      analista: '',
      booking: '',
      navio: '',
      origemDestino: '',
      terminalEstufagem: '',
      terminalEmbarque: '',
      despachante: '',
      transportadora: '',
  });

  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Processo' : 'Novo Processo (Nomeação)';
  const pageDescription = isEditing
    ? 'Altere as informações do processo selecionado.'
    : 'Inicie um novo processo de exportação a partir da nomeação.';

    const handleInputChange = (id: string, value: string) => {
        setFormData(prev => ({...prev, [id]: value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const storedProcessos = JSON.parse(localStorage.getItem('processos') || '[]');
        const newId = storedProcessos.length > 0 ? Math.max(...storedProcessos.map((p: any) => p.id)) + 1 : 1;

        const newProcesso = {
            id: newId,
            referencia: formData.referencia,
            cliente: clients.find(c => c.id === formData.cliente)?.nomeEmpresa,
            po_number: formData.po_number,
            produto: products.find(p => p.id === formData.produto)?.descricao,
            navio: formData.navio,
            origemDestino: formData.origemDestino,
            analista: analistas.find(a => a.id === formData.analista)?.nome,
            status: 'Aguardando embarque',
            timeline: [{date: new Date().toLocaleDateString('pt-BR'), event: 'Processo criado no sistema'}]
        };

        const updatedProcessos = [...storedProcessos, newProcesso];
        localStorage.setItem('processos', JSON.stringify(updatedProcessos));
        
        toast({
            title: "Sucesso!",
            description: "O processo foi salvo e os parceiros foram notificados.",
            variant: "default",
        })

        router.push('/dashboard/processos');
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className='flex items-center gap-4'>
                <Link href="/dashboard/processos" passHref>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                <CardTitle>{pageTitle}</CardTitle>
                <CardDescription>
                    {pageDescription}
                </CardDescription>
                </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
             <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4']} className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className='text-base font-semibold'>Dados do Processo</AccordionTrigger>
                    <AccordionContent className='grid md:grid-cols-2 gap-6 pt-4'>
                        <div className="space-y-2">
                            <Label htmlFor="referencia-interna">Referência Interna</Label>
                            <Input id="referencia" value={formData.referencia} onChange={e => handleInputChange('referencia', e.target.value)} placeholder="Ex: SEN2378-25" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="po-number">PO Number (Purchase Order)</Label>
                            <Input id="po_number" value={formData.po_number} onChange={e => handleInputChange('po_number', e.target.value)} placeholder="Insira o número da PO" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="cliente-vinculado">Cliente Vinculado</Label>
                            <Select value={formData.cliente} onValueChange={value => handleInputChange('cliente', value)}>
                                <SelectTrigger id="cliente-vinculado">
                                    <SelectValue placeholder="Selecione um cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={String(client.id)}>
                                            {client.nomeEmpresa}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="produto-vinculado">Produto Vinculado</Label>
                            <Select value={formData.produto} onValueChange={value => handleInputChange('produto', value)}>
                                <SelectTrigger id="produto-vinculado">
                                    <SelectValue placeholder="Selecione um produto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={String(product.id)}>
                                            {product.descricao}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="analista-responsavel">Analista Responsável</Label>
                            <Select value={formData.analista} onValueChange={value => handleInputChange('analista', value)}>
                                <SelectTrigger id="analista-responsavel">
                                    <SelectValue placeholder="Selecione um analista" />
                                </SelectTrigger>
                                <SelectContent>
                                    {analistas.map((analista) => (
                                        <SelectItem key={analista.id} value={String(analista.id)}>
                                            {analista.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className='text-base font-semibold'>Detalhes Logísticos</AccordionTrigger>
                    <AccordionContent className='grid md:grid-cols-2 gap-6 pt-4'>
                        <div className="space-y-2">
                            <Label htmlFor="booking">Contrato / Reserva / Booking</Label>
                            <Input id="booking" value={formData.booking} onChange={e => handleInputChange('booking', e.target.value)} placeholder="Insira o número do booking"/>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="navio-viagem">Navio + Viagem</Label>
                            <Input id="navio" value={formData.navio} onChange={e => handleInputChange('navio', e.target.value)} placeholder="Ex: MSC CARMEN VZ001" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="origem-destino">Origem / Destino</Label>
                            <Input id="origemDestino" value={formData.origemDestino} onChange={e => handleInputChange('origemDestino', e.target.value)} placeholder="Ex: Santos / Xangai"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="terminal-estufagem">Terminal de Estufagem</Label>
                            <Select value={formData.terminalEstufagem} onValueChange={value => handleInputChange('terminalEstufagem', value)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{parceiros.map(p=><SelectItem key={p.id} value={String(p.id)}>{p.nome}</SelectItem>)}</SelectContent></Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="terminal-embarque">Terminal de Embarque</Label>
                            <Select value={formData.terminalEmbarque} onValueChange={value => handleInputChange('terminalEmbarque', value)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{parceiros.map(p=><SelectItem key={p.id} value={String(p.id)}>{p.nome}</SelectItem>)}</SelectContent></Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="despachante">Despachante</Label>
                            <Select value={formData.despachante} onValueChange={value => handleInputChange('despachante', value)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{parceiros.map(p=><SelectItem key={p.id} value={String(p.id)}>{p.nome}</SelectItem>)}</SelectContent></Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="transportadora">Transportadora</Label>
                            <Select value={formData.transportadora} onValueChange={value => handleInputChange('transportadora', value)}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{parceiros.map(p=><SelectItem key={p.id} value={String(p.id)}>{p.nome}</SelectItem>)}</SelectContent></Select>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className='text-base font-semibold'>Deadlines</AccordionTrigger>
                    <AccordionContent className="grid md:grid-cols-3 gap-6 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="deadline-draft">Deadline Draft</Label>
                            <DatePicker />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline-vgm">Deadline VGM</Label>
                            <DatePicker />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline-carga">Deadline Carga</Label>
                        <DatePicker />
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 {isEditing && (
                <AccordionItem value="item-4">
                    <AccordionTrigger className='text-base font-semibold'>Documentos</AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className='grid lg:grid-cols-2 gap-6'>
                            <Card className='bg-muted/30'>
                                <CardHeader>
                                    <CardTitle className='text-lg'>Controle de Documentos</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid md:grid-cols-2 gap-4 items-end">
                                    <div className="space-y-2">
                                        <Label htmlFor="lpco-numero">Número LPCO</Label>
                                        <Input id="lpco-numero" placeholder="Insira o número do LPCO" defaultValue="LPCO24000123" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lpco-status">Status LPCO</Label>
                                        <Select defaultValue="liberado">
                                            <SelectTrigger id="lpco-status"><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="liberado">Liberado</SelectItem>
                                                <SelectItem value="pendente">Pendente</SelectItem>
                                                <SelectItem value="em_analise">Em Análise</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 items-end">
                                    <div className="space-y-2">
                                        <Label htmlFor="due-numero">Número DUE</Label>
                                        <Input id="due-numero" placeholder="Insira o número da DUE" defaultValue="24BR0001234567" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="due-status">Status DUE</Label>
                                        <Select defaultValue="averbada">
                                            <SelectTrigger id="due-status"><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="averbada">Averbada</SelectItem>
                                                <SelectItem value="em_analise">Em Análise</SelectItem>
                                                <SelectItem value="nao_iniciada">Não Iniciada</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    </div>
                                    <div className="grid gap-4">
                                        <Label>Upload de Documentos (Drafts e Finais)</Label>
                                        <div className='grid md:grid-cols-3 gap-4'>
                                            <Button variant="outline"><UploadCloud className="mr-2 h-4 w-4" /> BL / B/L</Button>
                                            <Button variant="outline"><UploadCloud className="mr-2 h-4 w-4" /> Invoice</Button>
                                            <Button variant="outline"><UploadCloud className="mr-2 h-4 w-4" /> Packing List</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className='bg-muted/30'>
                                <CardHeader>
                                    <CardTitle className='text-lg'>Checklist do Processo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {checklistItems.map(item => (
                                            <div key={item.id} className="flex items-center space-x-3">
                                                <Checkbox id={item.id} defaultChecked />
                                                <Label htmlFor={item.id} className="font-normal text-sm">{item.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                )}
            </Accordion>

             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/processos" passHref>
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button type="submit">Salvar</Button>
             </div>
          </form>
        </CardContent>
      </Card>

      {isEditing && (
        <Card>
            <CardHeader>
                <CardTitle>Status da Carga (Timeline)</CardTitle>
                <CardDescription>Acompanhe os eventos do processo em ordem cronológica.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                     <ul className="space-y-6">
                        {timelineEvents.map((item, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <ClipboardCheck className="h-4 w-4" />
                                    </div>
                                    {index < timelineEvents.length - 1 && (
                                    <div className="h-12 w-px bg-border" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold">{item.event}</p>
                                    <time className="text-sm text-muted-foreground">{item.date}</time>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="space-y-4">
                        <Label htmlFor="new-event">Adicionar Novo Evento</Label>
                        <div className="flex gap-2">
                            <Input id="new-event" placeholder="Descreva o novo evento..."/>
                            <Button>Adicionar</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
