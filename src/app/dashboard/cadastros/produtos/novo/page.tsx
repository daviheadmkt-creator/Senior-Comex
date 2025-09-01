
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
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialClients: any[] = [];

export default function NovoProdutoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    codigo: '',
    descricao: '',
    ncm: '',
    unidade: '',
    clienteId: '',
  });
  const [clients, setClients] = useState(initialClients);

  useEffect(() => {
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
  }, []);

  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Produto' : 'Novo Produto';
  const pageDescription = isEditing
    ? 'Altere as informações do produto selecionado.'
    : 'Adicione um novo produto à sua base de dados.';
    
  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({...prev, [id]: value}));
  }
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const newId = storedProducts.length > 0 ? Math.max(...storedProducts.map((p: any) => p.id)) + 1 : 1;
    
    const selectedClient = clients.find(c => c.id === Number(formData.clienteId));

    const newProduct = {
      id: newId,
      codigo: formData.codigo,
      descricao: formData.descricao,
      ncm: formData.ncm,
      unidade: formData.unidade,
      cliente: selectedClient ? selectedClient.nomeEmpresa : 'N/A',
      clienteId: formData.clienteId
    };

    const updatedProducts = [...storedProducts, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    toast({
        title: "Sucesso!",
        description: "O produto foi salvo.",
        variant: "default",
    });

    router.push('/dashboard/cadastros/produtos');
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className='flex items-center gap-4'>
                <Link href="/dashboard/cadastros/produtos" passHref>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo-interno">Código Interno</Label>
                <Input id="codigo" value={formData.codigo} onChange={e => handleInputChange('codigo', e.target.value)} placeholder="Ex: FEJ-001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" value={formData.descricao} onChange={e => handleInputChange('descricao', e.target.value)} placeholder="Ex: Feijão Carioca Tipo 1" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ncm">NCM / Classificação Fiscal</Label>
                <Input id="ncm" value={formData.ncm} onChange={e => handleInputChange('ncm', e.target.value)} placeholder="Ex: 0713.33.19" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade-medida">Unidade de Medida</Label>
                <Input id="unidade" value={formData.unidade} onChange={e => handleInputChange('unidade', e.target.value)} placeholder="Ex: SC 60kg, TN, KG" />
              </div>
            </div>
             <div className="grid md:grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cliente-vinculado">Cliente Vinculado</Label>
                    <Select value={formData.clienteId} onValueChange={value => handleSelectChange('clienteId', value)}>
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
             </div>

             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/cadastros/produtos" passHref>
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button type="submit">Salvar</Button>
             </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
