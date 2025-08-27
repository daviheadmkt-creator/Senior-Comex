
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
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';

const clients = [
  { id: 1, nome: 'Agrícola Exemplo LTDA' },
  { id: 2, nome: 'Comércio de Grãos Brasil S.A.' },
  { id: 3, nome: 'MSC' },
  { id: 4, nome: 'Sérgio Despachos' },
];

export default function NovoLancamentoPage() {
  const searchParams = useSearchParams();
  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Lançamento' : 'Novo Lançamento';
  const pageDescription = isEditing
    ? 'Altere as informações do lançamento financeiro.'
    : 'Adicione uma nova receita ou despesa.';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className='flex items-center gap-4'>
                <Link href="/dashboard/financeiro/lancamentos" passHref>
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
                <Label htmlFor="descricao">Descrição do Lançamento</Label>
                <Input id="descricao" placeholder="Ex: Receita Venda Soja EXP-001" defaultValue={isEditing ? 'Receita Venda Soja EXP-001' : ''} />
            </div>
             <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Lançamento</Label>
                    <Select defaultValue={isEditing ? 'receita' : undefined}>
                        <SelectTrigger id="tipo">
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="receita">Receita</SelectItem>
                           <SelectItem value="despesa">Despesa</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cliente-fornecedor">Cliente / Fornecedor</Label>
                    <Select defaultValue={isEditing ? '1' : undefined}>
                        <SelectTrigger id="cliente-fornecedor">
                            <SelectValue placeholder="Selecione um cliente ou fornecedor" />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.map((client) => (
                                <SelectItem key={client.id} value={String(client.id)}>
                                    {client.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
             </div>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="valor-previsto">Valor Previsto</Label>
                    <Input id="valor-previsto" type="number" placeholder="0,00" defaultValue={isEditing ? 50000 : ''} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="valor-realizado">Valor Realizado</Label>
                    <Input id="valor-realizado" type="number" placeholder="0,00" />
                </div>
             </div>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="data-competencia">Data de Competência</Label>
                    <DatePicker />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="data-vencimento">Data de Vencimento/Pagamento</Label>
                    <DatePicker />
                </div>
             </div>

             <Separator />

             <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="status">Status do Lançamento</Label>
                    <Select defaultValue={isEditing ? 'recebido' : undefined}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="recebido">Recebido</SelectItem>
                           <SelectItem value="pago">Pago</SelectItem>
                           <SelectItem value="a_receber">A Receber</SelectItem>
                           <SelectItem value="a_pagar">A Pagar</SelectItem>
                           <SelectItem value="atrasado">Atrasado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
             </div>
             <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" placeholder="Adicione qualquer observação relevante..." />
            </div>

             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/financeiro/lancamentos" passHref>
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
