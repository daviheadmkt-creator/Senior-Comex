
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Edit, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

const categorias = [
    {id: 1, descricao: 'Receita de Venda de Soja', tipo: 'Receita', origem: 'Venda', natureza: 'Variável' },
    {id: 2, descricao: 'Despesa com Frete', tipo: 'Despesa', origem: 'Serviço', natureza: 'Variável' },
    {id: 3, descricao: 'Salários Administrativo', tipo: 'Despesa', origem: 'Outros', natureza: 'Fixa' },
    {id: 4, descricao: 'Receita de Aluguel de Máquina', tipo: 'Receita', origem: 'Serviço', natureza: 'Extraordinária' },
]

export default function FinanceiroPage() {
  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Link href="/dashboard/configuracoes" passHref>
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Configurações Financeiras
                </h1>
                <p className="text-muted-foreground">
                    Gerencie suas categorias de receitas e despesas.
                </p>
            </div>
        </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Categorias Cadastradas</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Origem</TableHead>
                                <TableHead>Natureza</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categorias.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.descricao}</TableCell>
                                    <TableCell>{cat.tipo}</TableCell>
                                    <TableCell>{cat.origem}</TableCell>
                                    <TableCell>{cat.natureza}</TableCell>
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                                            <Button variant="outline" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Nova Categoria</CardTitle>
                    <CardDescription>Adicione uma nova categoria de receita ou despesa.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Input id="descricao" placeholder="Ex: Receita com Vendas" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tipo">Tipo</Label>
                            <Select>
                                <SelectTrigger id="tipo"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="receita">Receita</SelectItem>
                                    <SelectItem value="despesa">Despesa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="origem">Origem</Label>
                            <Select>
                                <SelectTrigger id="origem"><SelectValue placeholder="Selecione a origem" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="venda">Venda</SelectItem>
                                    <SelectItem value="servico">Serviço</SelectItem>
                                    <SelectItem value="investimento">Investimento</SelectItem>
                                    <SelectItem value="outros">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="natureza">Natureza</Label>
                            <Select>
                                <SelectTrigger id="natureza"><SelectValue placeholder="Selecione a natureza" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixa">Fixa</SelectItem>
                                    <SelectItem value="variavel">Variável</SelectItem>
                                    <SelectItem value="extraordinaria">Extraordinária</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Categoria
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
