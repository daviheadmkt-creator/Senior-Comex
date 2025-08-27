
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
import { useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';


export default function NovoUsuarioPage() {
  const searchParams = useSearchParams();
  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Usuário' : 'Novo Usuário';
  const pageDescription = isEditing
    ? 'Altere as informações do usuário selecionado.'
    : 'Adicione um novo usuário e defina suas permissões.';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className='flex items-center gap-4'>
                <Link href="/dashboard/cadastros/usuarios" passHref>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome-completo">Nome Completo</Label>
                <Input id="nome-completo" placeholder="Insira o nome do usuário" defaultValue={isEditing ? 'Ana Silva' : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="usuario@email.com" defaultValue={isEditing ? 'ana.silva@empresa.com' : ''}/>
              </div>
            </div>
            
            <Separator />

            <div>
                <h3 className="text-lg font-medium mb-4">Perfil e Permissões</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="perfil-usuario">Perfil</Label>
                        <Select defaultValue={isEditing ? 'gestor' : undefined}>
                            <SelectTrigger id="perfil-usuario">
                                <SelectValue placeholder="Selecione um perfil" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="analista">Analista</SelectItem>
                                <SelectItem value="gestor">Gestor</SelectItem>
                                <SelectItem value="cliente">Cliente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Permissões Específicas</Label>
                        <div className="flex items-center space-x-4 pt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="perm-visualizar" defaultChecked={isEditing}/>
                                <Label htmlFor="perm-visualizar" className='font-normal'>Visualizar</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="perm-editar" defaultChecked={isEditing} />
                                <Label htmlFor="perm-editar" className='font-normal'>Editar</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="perm-aprovar" />
                                <Label htmlFor="perm-aprovar" className='font-normal'>Aprovar</Label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/cadastros/usuarios" passHref>
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
