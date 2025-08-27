
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Edit, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

const tiposCadastro = [
    {id: 1, descricao: 'Agente', status: 'Ativo' },
    {id: 2, descricao: 'Controlador', status: 'Ativo' },
    {id: 3, descricao: 'Terminal', status: 'Ativo' },
    {id: 4, descricao: 'Fornecedor', status: 'Ativo' },
    {id: 5, descricao: 'Transportadora', status: 'Inativo' },
    {id: 6, descricao: 'Cliente Nacional', status: 'Ativo' },
    {id: 7, descricao: 'Cliente Internacional', status: 'Ativo' },
]

export default function TiposCadastroPage() {
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
                    Tipos de Cadastro
                </h1>
                <p className="text-muted-foreground">
                    Gerencie os tipos de cadastros utilizados no sistema.
                </p>
            </div>
        </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Tipos Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tiposCadastro.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.descricao}</TableCell>
                                    <TableCell>{cat.status}</TableCell>
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
                    <CardTitle>Novo Tipo</CardTitle>
                    <CardDescription>Adicione um novo tipo de cadastro.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Input id="descricao" placeholder="Ex: Despachante" />
                        </div>
                        <Button className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Tipo
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
