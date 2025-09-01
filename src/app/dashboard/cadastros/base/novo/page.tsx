
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
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const tiposCadastro = [
    {id: 'agente', descricao: 'Agente' },
    {id: 'controlador', descricao: 'Controlador' },
    {id: 'terminal', descricao: 'Terminal' },
    {id: 'fornecedor', descricao: 'Fornecedor' },
    {id: 'transportadora', descricao: 'Transportadora' },
    {id: 'cliente_internacional', descricao: 'Cliente Internacional' },
]


export default function NovoCadastroBasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    tipo: '',
    nome: '',
    contatoNome: '',
    contatoEmail: '',
    contatoTelefone: '',
    terminais: '',
    condicoes: '',
  });

  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Cadastro' : 'Novo Cadastro';
  const pageDescription = isEditing
    ? 'Altere as informações do cadastro selecionado.'
    : 'Adicione um novo cadastro base à sua empresa.';
    
  const getNomeLabel = () => {
    const tipo = tiposCadastro.find(t => t.id === formData.tipo);
    return tipo ? `Nome do ${tipo.descricao}` : 'Nome';
  }

  const getNomePlaceholder = () => {
      const tipo = tiposCadastro.find(t => t.id === formData.tipo);
      return tipo ? `Insira o nome do ${tipo.descricao.toLowerCase()}` : 'Selecione um tipo de cadastro';
  }

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedBase = JSON.parse(localStorage.getItem('base_cadastros') || '[]');
    const newId = storedBase.length > 0 ? Math.max(...storedBase.map((c: any) => c.id)) + 1 : 1;

    const tipoDescricao = tiposCadastro.find(t => t.id === formData.tipo)?.descricao || 'N/A';

    const newCadastro = {
      id: newId,
      nome: formData.nome,
      tipo: tipoDescricao,
      contatoPrincipal: formData.contatoNome,
      terminais: formData.terminais,
    };

    const updatedBase = [...storedBase, newCadastro];
    localStorage.setItem('base_cadastros', JSON.stringify(updatedBase));
    
    toast({
        title: "Sucesso!",
        description: "O cadastro foi salvo.",
        variant: "default",
    });

    router.push('/dashboard/cadastros/base');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className='flex items-center gap-4'>
                <Link href="/dashboard/cadastros/base" passHref>
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
             <div className="space-y-2">
                <Label htmlFor="tipo-cadastro">Tipo de Cadastro</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                    <SelectTrigger id="tipo-cadastro">
                        <SelectValue placeholder="Selecione um tipo de cadastro" />
                    </SelectTrigger>
                    <SelectContent>
                        {tiposCadastro.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.id}>
                                {tipo.descricao}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="nome-cadastro">{getNomeLabel()}</Label>
                <Input 
                    id="nome" 
                    value={formData.nome}
                    onChange={e => handleInputChange('nome', e.target.value)}
                    placeholder={getNomePlaceholder()} 
                    disabled={!formData.tipo}
                />
            </div>
            
            <Separator />

            <div>
                <h3 className="text-lg font-medium mb-4">Contatos Comerciais</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="comercial-nome">Nome</Label>
                        <Input id="contatoNome" value={formData.contatoNome} onChange={e => handleInputChange('contatoNome', e.target.value)} placeholder="Nome do contato comercial" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comercial-email">E-mail</Label>
                        <Input id="contatoEmail" value={formData.contatoEmail} onChange={e => handleInputChange('contatoEmail', e.target.value)} type="email" placeholder="email@exemplo.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comercial-telefone">Telefone</Label>
                        <Input id="contatoTelefone" value={formData.contatoTelefone} onChange={e => handleInputChange('contatoTelefone', e.target.value)} placeholder="(00) 00000-0000" />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <Label htmlFor="terminais">Terminais de Atuação</Label>
                <Input id="terminais" value={formData.terminais} onChange={e => handleInputChange('terminais', e.target.value)} placeholder="Ex: Porto de Santos, Porto de Paranaguá" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="condicoes-frete">Condições de Frete</Label>
                <Textarea id="condicoes" value={formData.condicoes} onChange={e => handleInputChange('condicoes', e.target.value)} placeholder="Descreva as condições de frete negociadas, taxas, etc." />
            </div>

             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/cadastros/base" passHref>
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
