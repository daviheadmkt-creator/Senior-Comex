
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Bell, Palette, Languages, KeyRound } from 'lucide-react';

export default function ConfiguracoesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-md">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>
              Ajuste as preferências do sistema e de sua conta.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><User className="h-5 w-5"/> Conta de Usuário</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome-usuario">Nome</Label>
                <Input id="nome-usuario" defaultValue="Operador" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-usuario">E-mail</Label>
                <Input id="email-usuario" type="email" defaultValue="operador@wowdash.com" disabled />
              </div>
            </div>
            <div className="flex items-center space-x-2">
               <KeyRound className="h-5 w-5 text-muted-foreground" />
                <Button variant="link" className="p-0 h-auto">Alterar senha</Button>
            </div>
          </div>
        </section>

        <Separator />

        <section>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><Palette className="h-5 w-5" /> Aparência e Idioma</h2>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Tema</Label>
                     <Select defaultValue="system">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Escuro</SelectItem>
                            <SelectItem value="system">Padrão do Sistema</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label>Idioma</Label>
                     <Select defaultValue="pt-br">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                            <SelectItem value="en-us">Inglês (EUA)</SelectItem>
                             <SelectItem value="es-es">Espanhol</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </section>

        <Separator />
        
        <section>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><Bell className="h-5 w-5"/> Notificações</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="notif-email">Notificações por e-mail</Label>
                        <p className="text-sm text-muted-foreground">Receba alertas importantes sobre seus processos.</p>
                    </div>
                    <Switch id="notif-email" defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <Label htmlFor="notif-prazos">Alertas de Prazos</Label>
                        <p className="text-sm text-muted-foreground">Seja notificado sobre vencimentos próximos.</p>
                    </div>
                    <Switch id="notif-prazos" defaultChecked />
                </div>
            </div>
        </section>

         <div className="flex justify-end pt-4">
            <Button>Salvar Alterações</Button>
          </div>
      </CardContent>
    </Card>
  );
}
