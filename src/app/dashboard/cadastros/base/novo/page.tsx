
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
import { useSearchParams } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const tiposCadastro = [
    {id: 'agente', descricao: 'Agente' },
    {id: 'controlador', descricao: 'Controlador' },
    {id: 'terminal', descricao: 'Terminal' },
    {id: 'fornecedor', descricao: 'Fornecedor' },
    {id: 'transportadora', descricao: 'Transportadora' },
    {id: 'cliente_nacional', descricao: 'Cliente Nacional' },
    {id: 'cliente_internacional', descricao: 'Cliente Internacional' },
]


export default function NovoCadastroBasePage() {
  const searchParams = useSearchParams();
  const isEditing = searchParams.has('edit');
  const [tipoCadastro, setTipoCadastro] = useState(isEditing ? 'agente' : '');
  
  const pageTitle = isEditing ? 'Editar Cadastro' : 'Novo Cadastro';
  const pageDescription = isEditing
    ? 'Altere as informações do cadastro selecionado.'
    : 'Adicione um novo cadastro base à sua empresa.';
    
  const getNomeLabel = () => {
    const tipo = tiposCadastro.find(t => t.id === tipoCadastro);
    return tipo ? `Nome do ${tipo.descricao}` : 'Nome';
  }

  const getNomePlaceholder = () => {
      const tipo = tiposCadastro.find(t => t.id === tipoCadastro);
      return tipo ? `Insira o nome do ${tipo.descricao.toLowerCase()}` : 'Selecione um tipo de cadastro';
  }

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
          <form className="grid gap-6">
             <div className="space-y-2">
                <Label htmlFor="tipo-cadastro">Tipo de Cadastro</Label>
                <Select value={tipoCadastro} onValueChange={setTipoCadastro}>
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
                    id="nome-cadastro" 
                    placeholder={getNomePlaceholder()} 
                    defaultValue={isEditing ? 'MSC' : ''}
                    disabled={!tipoCadastro}
                />
            </div>
            
            <Separator />

            <div>
                <h3 className="text-lg font-medium mb-4">Contatos Comerciais</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="comercial-nome">Nome</Label>
                        <Input id="comercial-nome" placeholder="Nome do contato comercial" defaultValue={isEditing ? 'João Carlos' : ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comercial-email">E-mail</Label>
                        <Input id="comercial-email" type="email" placeholder="email@exemplo.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comercial-telefone">Telefone</Label>
                        <Input id="comercial-telefone" placeholder="(00) 00000-0000" />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <Label htmlFor="terminais">Terminais de Atuação</Label>
                <Input id="terminais" placeholder="Ex: Porto de Santos, Porto de Paranaguá" defaultValue={isEditing ? 'Porto de Santos, Porto de Paranaguá' : ''}/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="condicoes-frete">Condições de Frete</Label>
                <Textarea id="condicoes-frete" placeholder="Descreva as condições de frete negociadas, taxas, etc." />
            </div>

             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/cadastros/base" passHref>
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button>Salvar</Button>
             </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
