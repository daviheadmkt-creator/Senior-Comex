
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
import { ArrowLeft, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from '@/components/ui/date-picker';


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

const timelineEvents = [
    {date: '03/07/2024', event: 'Reserva feita no CMA CGM BUZIOS'},
    {date: '27/07/2024', event: 'Embarque previsto'},
    {date: '31/07/2024', event: 'Carga embarcada'},
    {date: '08/09/2024', event: 'Previsão de chegada'},
]

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

            <Separator />
            
            <div>
                <h3 className="text-lg font-medium mb-4">Deadlines do Embarque</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="deadline-draft">Deadline Draft</Label>
                        <DatePicker />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deadline-vgm">Deadline VGM</Label>
                        <DatePicker />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deadline-carga">Deadline Carga</Label>
                       <DatePicker />
                    </div>
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

      {isEditing && (
        <Card>
            <CardHeader>
                <CardTitle>Status da Carga (Timeline)</CardTitle>
                <CardDescription>Acompanhe os eventos do embarque em ordem cronológica.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                     <ul className="space-y-6">
                        {timelineEvents.map((item, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <ClipboardCheck className="h-4 w-4" />
                                    </div>
                                    {index < timelineEvents.length - 1 && (
                                    <div className="h-12 w-px bg-border" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold">{item.event}</p>
                                    <time className="text-sm text-muted-foreground">{item.date}</time>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="space-y-4">
                        <Label htmlFor="new-event">Adicionar Novo Evento</Label>
                        <div className="flex gap-2">
                            <Input id="new-event" placeholder="Descreva o novo evento..."/>
                            <Button>Adicionar</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
