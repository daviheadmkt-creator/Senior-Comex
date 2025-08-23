
"use client";

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, FileDown, Trash2, Edit, Copy, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Liquidado':
            return 'bg-green-100 text-green-800';
        case 'A liquidar':
            return 'bg-yellow-100 text-yellow-800';
        case 'Cancelado':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function ControleCambioPage() {
    const [activeTab, setActiveTab] = useState("listagem");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
                <TabsList>
                    <TabsTrigger value="listagem">Contratos de Câmbio</TabsTrigger>
                    <TabsTrigger value="cadastro">Novo Contrato</TabsTrigger>
                </TabsList>
                 <Button onClick={() => setActiveTab("cadastro")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Contrato
                </Button>
            </div>
            <TabsContent value="listagem">
                <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Controle de Contratos de Câmbio</CardTitle>
                        <CardDescription>
                        Gerencie e acompanhe seus contratos de fechamento de câmbio.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4">
                        <Input placeholder="Buscar por nº do contrato ou cliente..." className="md:col-span-2" />
                        <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Filtrar por tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="exportacao">Câmbio de Exportação</SelectItem>
                                <SelectItem value="importacao">Câmbio de Importação</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="liquidado">Liquidado</SelectItem>
                                <SelectItem value="a-liquidar">A liquidar</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border rounded-md">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nº Contrato</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Valor (Moeda Estrangeira)</TableHead>
                            <TableHead>Taxa de Câmbio (R$)</TableHead>
                            <TableHead>Data Liquidação</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[5%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">CC-EXP-2024-001</TableCell>
                                <TableCell>Exportação</TableCell>
                                <TableCell>USD 21.800,00</TableCell>
                                <TableCell>5,45</TableCell>
                                <TableCell>15/08/2024</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('A liquidar')}>A liquidar</Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Ver / Editar</DropdownMenuItem>
                                            <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Baixar Comprovante</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Cancelar Contrato</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        </Table>
                    </div>
                </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="cadastro">
                 <Card>
                    <CardHeader>
                        <CardTitle>Registro de Contrato de Câmbio</CardTitle>
                        <CardDescription>
                        Preencha os campos para registrar um novo fechamento de câmbio.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contrato-numero">Número do Contrato</Label>
                                        <Input id="contrato-numero" placeholder="Número fornecido pelo banco" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tipo de Operação</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="exportacao">Câmbio de Exportação</SelectItem>
                                                <SelectItem value="importacao">Câmbio de Importação</SelectItem>
                                                <SelectItem value="financeiro">Financeiro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="data-fechamento">Data de Fechamento</Label>
                                        <Input id="data-fechamento" type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="data-liquidacao">Data de Liquidação</Label>
                                        <Input id="data-liquidacao" type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Banco/Corretora</Label>
                                        <Input placeholder="Nome da instituição financeira" />
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                 <h4 className="font-semibold text-md">Valores da Operação</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Moeda Estrangeira</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a moeda" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="usd">USD</SelectItem>
                                                <SelectItem value="eur">EUR</SelectItem>
                                                <SelectItem value="gbp">GBP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="valor-moeda-estrangeira">Valor na Moeda Estrangeira</Label>
                                        <Input id="valor-moeda-estrangeira" type="number" placeholder="21800.00" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="taxa-cambio">Taxa de Câmbio (R$)</Label>
                                        <Input id="taxa-cambio" type="number" placeholder="5.45" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="valor-brl">Valor Equivalente em Reais (R$)</Label>
                                        <Input id="valor-brl" type="number" placeholder="118810.00" readOnly />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="fatura-ref">Fatura(s) de Referência</Label>
                                        <Input id="fatura-ref" placeholder="CI-2024-001" />
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Status do Contrato</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="a-liquidar">A liquidar</SelectItem>
                                                <SelectItem value="liquidado">Liquidado</SelectItem>
                                                <SelectItem value="cancelado">Cancelado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="comprovante">Anexar Comprovante</Label>
                                        <Input id="comprovante" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="obs-cambio">Observações</Label>
                                    <Textarea id="obs-cambio" placeholder="Detalhes da negociação, contato no banco, etc." />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" type="button" onClick={() => setActiveTab("listagem")}>Cancelar</Button>
                                <Button type="submit">Salvar Contrato</Button>
                            </div>
                        </form>
                    </CardContent>
                    </Card>
            </TabsContent>
        </Tabs>
    );
}
