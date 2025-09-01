
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
import { DatePicker } from '@/components/ui/date-picker';

const moedas: any[] = []

export default function MoedasCambioPage() {
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
                    Moedas e Câmbio
                </h1>
                <p className="text-muted-foreground">
                    Gerencie as moedas e as taxas de câmbio utilizadas nas operações.
                </p>
            </div>
        </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Moedas Cadastradas</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Moeda</TableHead>
                                <TableHead>Taxa de Câmbio (R$)</TableHead>
                                <TableHead>Data da Conversão</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {moedas.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-medium">{m.moeda}</TableCell>
                                    <TableCell>{m.taxa}</TableCell>
                                    <TableCell>{m.data}</TableCell>
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
                    <CardTitle>Nova Moeda</CardTitle>
                    <CardDescription>Adicione uma nova moeda e sua taxa de câmbio.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="moeda-nome">Nome da Moeda</Label>
                            <Input id="moeda-nome" placeholder="Ex: Dólar Americano (USD)" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="taxa">Taxa de Câmbio</Label>
                            <Input id="taxa" type="number" placeholder="Ex: 5.25" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="data-conversao">Data da Conversão</Label>
                            <DatePicker />
                        </div>
                        <Button className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Moeda
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
