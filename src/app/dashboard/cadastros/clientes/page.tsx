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
import { PlusCircle } from 'lucide-react';

export default function CadastroClientePage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Cadastro de Clientes</CardTitle>
            <CardDescription>
              Adicione, edite ou visualize os clientes da sua empresa.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="razao-social">Razão Social</Label>
              <Input id="razao-social" placeholder="Insira a razão social" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome-fantasia">Nome Fantasia</Label>
              <Input id="nome-fantasia" placeholder="Insira o nome fantasia" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" placeholder="00.000.000/0000-00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inscricao-estadual">Inscrição Estadual</Label>
              <Input id="inscricao-estadual" placeholder="Insira a inscrição estadual" />
            </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" placeholder="Rua, número, bairro..." />
          </div>
           <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input id="cidade" placeholder="Insira a cidade" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input id="estado" placeholder="Insira o estado" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" placeholder="00000-000" />
                </div>
           </div>
           <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar</Button>
           </div>
        </form>
      </CardContent>
    </Card>
  );
}
