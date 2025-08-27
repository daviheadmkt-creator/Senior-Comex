
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

const clients = [
  { id: 1, nomeEmpresa: 'Agrícola Exemplo LTDA' },
  { id: 2, nomeEmpresa: 'Comércio de Grãos Brasil S.A.' },
  { id: 3, nomeEmpresa: 'Fazenda Sol Nascente' },
  { id: 4, nomeEmpresa: 'Produtores Associados' },
];

const products = [
  { id: 1, descricao: 'Soja em Grãos' },
  { id: 2, descricao: 'Milho em Grãos' },
  { id: 3, descricao: 'Feijão Carioca Tipo 1' },
  { id: 4, descricao: 'Gergelim Branco' },
];

const analistas = [
  { id: 1, nome: 'Ana Silva' },
  { id: 2, nome: 'Carlos Dias' },
  { id: 3, nome: 'Daniela Lima' },
];

export default function NovoEmbarquePage() {
  const searchParams = useSearchParams();
  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Embarque' : 'Novo Embarque';
  const pageDescription = isEditing
    ? 'Altere as informações do embarque selecionado.'
    : 'Adicione um novo embarque à sua base de dados.';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className='flex items-center gap-4'>
                <Link href="/dashboard/gestao-embarques" passHref>
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
                <Label htmlFor="referencia-interna">Referência Interna</Label>
                <Input id="referencia-interna" placeholder="Ex: SEN2378-25" defaultValue={isEditing ? 'SEN2378-25' : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking">Contrato / Reserva / Booking</Label>
                <Input id="booking" placeholder="Insira o número do booking" defaultValue={isEditing ? 'BK12345678' : ''}/>
              </div>
            </div>
             <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cliente-vinculado">Cliente Vinculado</Label>
                    <Select defaultValue={isEditing ? '1' : undefined}>
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
                 <div className="space-y-2">
                    <Label htmlFor="produto-vinculado">Produto Vinculado</Label>
                    <Select defaultValue={isEditing ? '1' : undefined}>
                        <SelectTrigger id="produto-vinculado">
                            <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((product) => (
                                <SelectItem key={product.id} value={String(product.id)}>
                                    {product.descricao}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
             </div>
             <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="navio-viagem">Navio + Viagem</Label>
                <Input id="navio-viagem" placeholder="Ex: MSC CARMEN VZ001" defaultValue={isEditing ? 'MSC CARMEN VZ001' : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origem-destino">Origem / Destino</Label>
                <Input id="origem-destino" placeholder="Ex: Santos / Xangai" defaultValue={isEditing ? 'Santos / Xangai' : ''}/>
              </div>
            </div>
             <div className="grid md:grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="analista-responsavel">Analista Responsável</Label>
                    <Select defaultValue={isEditing ? '1' : undefined}>
                        <SelectTrigger id="analista-responsavel">
                            <SelectValue placeholder="Selecione um analista" />
                        </SelectTrigger>
                        <SelectContent>
                            {analistas.map((analista) => (
                                <SelectItem key={analista.id} value={String(analista.id)}>
                                    {analista.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
             </div>

             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/gestao-embarques" passHref>
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
