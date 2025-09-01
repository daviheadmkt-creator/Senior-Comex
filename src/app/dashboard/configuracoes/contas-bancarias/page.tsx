
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

const contas: any[] = []

export default function ContasBancariasPage() {
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
                    Contas Bancárias
                </h1>
                <p className="text-muted-foreground">
                    Gerencie as contas bancárias e meios de pagamento da empresa.
                </p>
            </div>
        </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Contas Cadastradas</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Banco</TableHead>
                                <TableHead>Agência / Conta</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Responsável</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contas.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.banco}</TableCell>
                                    <TableCell>{cat.agencia} / {cat.conta}</TableCell>
                                    <TableCell>{cat.tipo}</TableCell>
                                    <TableCell>{cat.responsavel}</TableCell>
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
                    <CardTitle>Nova Conta</CardTitle>
                    <CardDescription>Adicione uma nova conta ou meio de pagamento.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="banco">Nome do Banco</Label>
                            <Input id="banco" placeholder="Ex: Banco do Brasil (001)" />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className="space-y-2">
                                <Label htmlFor="agencia">Agência</Label>
                                <Input id="agencia" placeholder="Ex: 1234-5" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="conta">Conta</Label>
                                <Input id="conta" placeholder="Ex: 123.456-7" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tipo">Tipo</Label>
                            <Select>
                                <SelectTrigger id="tipo"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="corrente">Conta Corrente</SelectItem>
                                    <SelectItem value="poupanca">Poupança</SelectItem>
                                    <SelectItem value="caixa">Caixa</SelectItem>
                                    <SelectItem value="carteira">Carteira Digital</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="responsavel">Responsável</Label>
                            <Input id="responsavel" placeholder="Ex: Financeiro" />
                        </div>
                        <Button className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Conta
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
