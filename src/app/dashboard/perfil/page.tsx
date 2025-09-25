
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';

export default function PerfilPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e configurações de segurança.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize seus dados e foto de perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@user" />
                    <AvatarFallback>OP</AvatarFallback>
                </Avatar>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar Foto
                </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome-completo">Nome Completo</Label>
                <Input
                  id="nome-completo"
                  defaultValue="Operador"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="operador@senior.com"
                  disabled
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Salvar Alterações</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>Altere sua senha de acesso.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senha-atual">Senha Atual</Label>
              <Input
                id="senha-atual"
                type="password"
                placeholder="********"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="nova-senha">Nova Senha</Label>
                    <Input
                        id="nova-senha"
                        type="password"
                        placeholder="********"
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                    <Input
                        id="confirmar-senha"
                        type="password"
                        placeholder="********"
                    />
                </div>
            </div>
            <div className="flex justify-end">
              <Button>Alterar Senha</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
