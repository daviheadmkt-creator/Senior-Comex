
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


export default function NovoCadastroBasePage() {
  const searchParams = useSearchParams();
  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Cadastro' : 'Novo Cadastro';
  const pageDescription = isEditing
    ? 'Altere as informações do cadastro selecionado.'
    : 'Adicione um novo cadastro base à sua empresa.';

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
                <Label htmlFor="nome-cadastro">Nome</Label>
                <Input id="nome-cadastro" placeholder="Insira o nome" defaultValue={isEditing ? 'MSC' : ''} />
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
