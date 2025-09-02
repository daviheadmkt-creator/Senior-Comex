
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
import { ArrowLeft } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

export default function NovoProcessoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    po_number: '',
    produtoId: '',
    quantidade: '',
    exportadorId: '',
    terminalEstufagemId: '',
    portoEmbarqueId: '',
    portoDescargaId: '',
    status: 'Iniciado / Aguardando Booking'
  });

  const [produtos, setProdutos] = useState<any[]>([]);
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [portos, setPortos] = useState<any[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) setProdutos(JSON.parse(storedProducts));

    const storedPartners = localStorage.getItem('partners');
    if (storedPartners) setParceiros(JSON.parse(storedPartners));
    
    const storedPorts = localStorage.getItem('ports');
    if (storedPorts) setPortos(JSON.parse(storedPorts));
  }, []);

  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Processo' : 'Novo Processo (Nomeação)';
  const pageDescription = isEditing
    ? 'Altere as informações do processo selecionado.'
    : 'Inicie um novo processo a partir de uma nomeação.';

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedProcessos = JSON.parse(localStorage.getItem('processos') || '[]');
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
    };

    const updatedProcessos = [...storedProcessos, newProcesso];
    localStorage.setItem('processos', JSON.stringify(updatedProcessos));
    
    toast({
        title: "Sucesso!",
        description: "Novo processo criado a partir da nomeação.",
        variant: "default",
    });

    router.push('/dashboard/processos');
  };

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
                <CardDescription>{pageDescription}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="po_number">Nº do Contrato/PO</Label>
                <Input id="po_number" value={formData.po_number} onChange={e => handleInputChange('po_number', e.target.value)} placeholder="Ex: 3426B" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="produtoId">Produto</Label>
                <Select value={formData.produtoId} onValueChange={value => handleInputChange('produtoId', value)}>
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
                <Input id="quantidade" value={formData.quantidade} onChange={e => handleInputChange('quantidade', e.target.value)} placeholder="Ex: 270,00000 TON" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exportadorId">Unidade Carregadora (Exportador)</Label>
                <Select value={formData.exportadorId} onValueChange={value => handleInputChange('exportadorId', value)}>
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
                <Select value={formData.terminalEstufagemId} onValueChange={value => handleInputChange('terminalEstufagemId', value)}>
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
                <Select value={formData.portoEmbarqueId} onValueChange={value => handleInputChange('portoEmbarqueId', value)}>
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
                <Select value={formData.portoDescargaId} onValueChange={value => handleInputChange('portoDescargaId', value)}>
                  <SelectTrigger id="portoDescargaId">
                    <SelectValue placeholder="Selecione o porto" />
                  </SelectTrigger>
                  <SelectContent>
                    {portos.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Link href="/dashboard/processos" passHref>
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
              <Button type="submit">Salvar e Criar Processo</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
