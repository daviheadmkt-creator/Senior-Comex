
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
import { PlusCircle, MoreHorizontal, FileDown, Trash2, Edit, Copy, Search, Send, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Paga':
            return 'bg-green-100 text-green-800';
        case 'Enviada':
            return 'bg-blue-100 text-blue-800';
        case 'Em aberto':
            return 'bg-yellow-100 text-yellow-800';
        case 'Vencida':
            return 'bg-red-100 text-red-800';
        case 'Cancelada':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function FaturasBoletosPage() {
    const [activeTab, setActiveTab] = useState("listagem");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
                <TabsList>
                    <TabsTrigger value="listagem">Listagem de Faturas</TabsTrigger>
                    <TabsTrigger value="cadastro">Nova Fatura</TabsTrigger>
                </TabsList>
                 <Button onClick={() => setActiveTab("cadastro")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Fatura
                </Button>
            </div>
            <TabsContent value="listagem">
                <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Controle de Faturas e Boletos</CardTitle>
                        <CardDescription>
                        Gerencie e emita suas faturas de serviços e cobranças.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4">
                        <Input placeholder="Buscar por cliente ou nº da fatura..." className="md:col-span-2" />
                        <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="aberto">Em aberto</SelectItem>
                                <SelectItem value="paga">Paga</SelectItem>
                                <SelectItem value="vencida">Vencida</SelectItem>
                                <SelectItem value="cancelada">Cancelada</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Filtrar por moeda" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="brl">BRL</SelectItem>
                                <SelectItem value="usd">USD</SelectItem>
                                <SelectItem value="eur">EUR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border rounded-md">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nº Fatura</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Emissão</TableHead>
                            <TableHead>Vencimento</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Moeda</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[5%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">FAT-001</TableCell>
                                <TableCell>Importadora Exemplo LLC</TableCell>
                                <TableCell>15/07/2024</TableCell>
                                <TableCell>15/08/2024</TableCell>
                                <TableCell>1.500,00</TableCell>
                                <TableCell>USD</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('Paga')}>Paga</Badge>
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
                                            <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Baixar PDF</DropdownMenuItem>
                                            <DropdownMenuItem><Send className="mr-2 h-4 w-4" /> Enviar por E-mail</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Cancelar Fatura</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium">FAT-002</TableCell>
                                <TableCell>Fornecedor Nacional Ltda.</TableCell>
                                <TableCell>20/07/2024</TableCell>
                                <TableCell>20/08/2024</TableCell>
                                <TableCell>3.500,00</TableCell>
                                <TableCell>BRL</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('Em aberto')}>Em aberto</Badge>
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
                                            <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Baixar PDF</DropdownMenuItem>
                                            <DropdownMenuItem><Send className="mr-2 h-4 w-4" /> Enviar por E-mail</DropdownMenuItem>
                                            <DropdownMenuItem><DollarSign className="mr-2 h-4 w-4" /> Registrar Pagamento</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Cancelar Fatura</DropdownMenuItem>
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
                        <CardTitle>Emissão de Fatura / Boleto</CardTitle>
                        <CardDescription>
                        Preencha os campos para gerar uma nova cobrança.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Cliente / Empresa</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um cliente ou fornecedor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cliente1">Importadora Exemplo LLC</SelectItem>
                                                <SelectItem value="fornecedor1">Fornecedor Nacional Ltda.</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="referencia">Referência</Label>
                                        <Input id="referencia" placeholder="Ex: Proposta 123, Contrato XYZ" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="data-emissao">Data de Emissão</Label>
                                        <Input id="data-emissao" type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="data-vencimento">Data de Vencimento</Label>
                                        <Input id="data-vencimento" type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Moeda</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a moeda" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="brl">BRL</SelectItem>
                                                <SelectItem value="usd">USD</SelectItem>
                                                <SelectItem value="eur">EUR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Itens da Fatura</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50%]">Descrição</TableHead>
                                                    <TableHead>Quantidade</TableHead>
                                                    <TableHead>Valor Unitário</TableHead>
                                                    <TableHead>Total</TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><Input placeholder="Serviços de Assessoria Aduaneira" /></TableCell>
                                                    <TableCell><Input type="number" placeholder="1" /></TableCell>
                                                    <TableCell><Input type="number" placeholder="1500.00" /></TableCell>
                                                    <TableCell>USD 1,500.00</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                         <Button variant="outline" size="sm" className="mt-4">
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Adicionar Item
                                        </Button>
                                    </CardContent>
                                </Card>
                                 <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="instrucoes-pagamento">Instruções de Pagamento</Label>
                                        <Textarea id="instrucoes-pagamento" placeholder="Dados bancários para transferência, chave PIX, etc." />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="observacoes">Observações</Label>
                                        <Textarea id="observacoes" placeholder="Informações adicionais para o cliente." />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" type="button" onClick={() => setActiveTab("listagem")}>Cancelar</Button>
                                <Button type="submit">Salvar Fatura</Button>
                            </div>
                        </form>
                    </CardContent>
                    </Card>
            </TabsContent>
        </Tabs>
    );
}
