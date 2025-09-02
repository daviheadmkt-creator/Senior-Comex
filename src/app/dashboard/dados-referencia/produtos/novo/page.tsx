
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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function NovoProdutoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    descricao: '',
    descricao_en: '',
    ncm: '',
    unidade: 'KG',
    peso_padrao: '50',
    embalagem_padrao: 'Sacos de polipropileno branco',
  });

  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Produto' : 'Novo Produto';
  const pageDescription = isEditing
    ? 'Altere as informações do produto selecionado.'
    : 'Adicione um novo produto ao seu catálogo de exportação.';
    
  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({...prev, [id]: value}));
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const newId = storedProducts.length > 0 ? Math.max(...storedProducts.map((p: any) => p.id)) + 1 : 1;
    
    const newProduct = {
      id: newId,
      ...formData,
    };

    const updatedProducts = [...storedProducts, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    toast({
        title: "Sucesso!",
        description: "O produto foi salvo.",
        variant: "default",
    });

    router.push('/dashboard/dados-referencia/produtos');
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className='flex items-center gap-4'>
                <Link href="/dashboard/dados-referencia/produtos" passHref>
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
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" value={formData.descricao} onChange={e => handleInputChange('descricao', e.target.value)} placeholder="Ex: Gergelim" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao_en">Descrição em Inglês</Label>
                <Input id="descricao_en" value={formData.descricao_en} onChange={e => handleInputChange('descricao_en', e.target.value)} placeholder="Ex: SESAME SEEDS" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ncm">NCM / Classificação Fiscal</Label>
                <Input id="ncm" value={formData.ncm} onChange={e => handleInputChange('ncm', e.target.value)} placeholder="Ex: 12074090" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade de Medida Padrão</Label>
                <Input id="unidade" value={formData.unidade} onChange={e => handleInputChange('unidade', e.target.value)} placeholder="Ex: KG" />
              </div>
            </div>
             <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="peso_padrao">Peso Padrão por Embalagem (KG)</Label>
                    <Input id="peso_padrao" value={formData.peso_padrao} onChange={e => handleInputChange('peso_padrao', e.target.value)} placeholder="Ex: 50" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="embalagem_padrao">Tipo de Embalagem Padrão</Label>
                    <Input id="embalagem_padrao" value={formData.embalagem_padrao} onChange={e => handleInputChange('embalagem_padrao', e.target.value)} placeholder="Ex: Sacos de polipropileno branco" />
                </div>
             </div>

             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/dados-referencia/produtos" passHref>
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
