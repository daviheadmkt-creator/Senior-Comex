
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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cargo: '',
    permissao: 'Operador',
  });

  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Usuário' : 'Novo Usuário';
  const pageDescription = isEditing
    ? 'Altere as informações do usuário selecionado.'
    : 'Adicione um novo usuário e defina suas permissões.';

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const newId = storedUsers.length > 0 ? Math.max(...storedUsers.map((u: any) => u.id)) + 1 : 1;
    
    const newUser = {
      id: newId,
      ...formData,
    };

    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    toast({
        title: "Sucesso!",
        description: "O usuário foi salvo.",
        variant: "default",
    });

    router.push('/dashboard/dados-referencia/usuarios');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className='flex items-center gap-4'>
                <Link href="/dashboard/dados-referencia/usuarios" passHref>
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
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" value={formData.nome} onChange={e => handleInputChange('nome', e.target.value)} placeholder="Insira o nome do usuário" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail / Login</Label>
                <Input id="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} type="email" placeholder="usuario@email.com" />
              </div>
            </div>
             <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input id="cargo" value={formData.cargo} onChange={e => handleInputChange('cargo', e.target.value)} placeholder="Ex: COMÉRCIO EXTERIOR" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permissao">Nível de Permissão</Label>
                 <Select value={formData.permissao} onValueChange={value => handleInputChange('permissao', value)}>
                    <SelectTrigger id="permissao">
                        <SelectValue placeholder="Selecione um nível" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Operador">Operador</SelectItem>
                        <SelectItem value="Apenas Leitura">Apenas Leitura</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            
             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/dados-referencia/usuarios" passHref>
                    <Button variant="outline" type="button">Cancelar</Button>
                  </Link>
                  <Button type="submit">Salvar</Button>
             </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
