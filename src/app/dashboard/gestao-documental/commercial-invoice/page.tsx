
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
  TableFooter,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, FileDown, Trash2, Edit, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Emitida':
            return 'bg-blue-100 text-blue-800';
        case 'Paga':
            return 'bg-green-100 text-green-800';
        case 'Vencida':
            return 'bg-red-100 text-red-800';
        case 'Cancelada':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function GestaoCommercialInvoicePage() {
    const [activeTab, setActiveTab] = useState("listagem");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
                <TabsList>
                    <TabsTrigger value="listagem">Listagem</TabsTrigger>
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
                        <CardTitle>Controle de Commercial Invoices</CardTitle>
                        <CardDescription>
                        Gerencie e emita suas faturas comerciais de exportação.
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
                            <SelectItem value="emitida">Emitida</SelectItem>
                            <SelectItem value="paga">Paga</SelectItem>
                            <SelectItem value="vencida">Vencida</SelectItem>
                            <SelectItem value="cancelada">Cancelada</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input type="date" placeholder="Filtrar por data de emissão" />
                    </div>

                    <div className="border rounded-md">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nº Fatura</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Data de Emissão</TableHead>
                            <TableHead>Data de Vencimento</TableHead>
                            <TableHead>Valor Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[5%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">CI-2024-001</TableCell>
                                <TableCell>Importadora Exemplo LLC</TableCell>
                                <TableCell>15/07/2024</TableCell>
                                <TableCell>15/08/2024</TableCell>
                                <TableCell>$ 21.800,00</TableCell>
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
                                            <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicar Fatura</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Cancelar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">CI-2024-002</TableCell>
                                <TableCell>Global Trade Corp</TableCell>
                                <TableCell>20/07/2024</TableCell>
                                <TableCell>20/08/2024</TableCell>
                                <TableCell>$ 5.400,00</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('Emitida')}>Emitida</Badge>
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
                                            <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicar Fatura</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Cancelar</DropdownMenuItem>
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
                        <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Geração de Commercial Invoice</CardTitle>
                            <CardDescription>
                            Gere a nota fiscal de exportação para seus processos.
                            </CardDescription>
                        </div>
                        <Button>
                            <FileDown className="mr-2 h-4 w-4" />
                            Gerar PDF
                        </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-8">
                        <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']}>

                            <AccordionItem value="item-1">
                            <AccordionTrigger>1. Exportador e Importador</AccordionTrigger>
                            <AccordionContent className="space-y-6 p-1">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4 p-4 border rounded-md">
                                        <h4 className="font-semibold">Empresa Exportadora (Sua Empresa)</h4>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Razão Social:</strong> Senior Assessoria em Comércio Exterior Ltda<br />
                                            <strong>Endereço:</strong> Avenida Brasil, 1234, São Paulo - SP, Brasil<br />
                                            <strong>CNPJ:</strong> 00.123.456/0001-00<br />
                                            <strong>Contato:</strong> contato@seniorcomex.com / (11) 98765-4321
                                        </p>
                                    </div>
                                    <div className="space-y-4 p-4 border rounded-md">
                                        <h4 className="font-semibold">Cliente Internacional (Importador)</h4>
                                        <div className="space-y-2">
                                            <Label htmlFor="cliente">Selecione o Cliente</Label>
                                            <Select>
                                                <SelectTrigger id="cliente">
                                                    <SelectValue placeholder="Selecione um cliente cadastrado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cliente1">Importadora Exemplo LLC</SelectItem>
                                                    <SelectItem value="cliente2">Global Trade Corp</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Endereço:</strong> 1234 Main Street, New York, NY, USA<br />
                                            <strong>País:</strong> Estados Unidos<br />
                                            <strong>Tax ID:</strong> 98-7654321<br />
                                            <strong>Contato:</strong> John Doe / john.doe@example.com
                                        </p>
                                    </div>
                                </div>
                            </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                            <AccordionTrigger>2. Dados do Pedido e Logística</AccordionTrigger>
                            <AccordionContent className="space-y-4 p-1">
                                <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="invoice-number">Número da Commercial Invoice</Label>
                                    <Input id="invoice-number" value="CI-2024-001" readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emission-date">Data de emissão</Label>
                                    <Input id="emission-date" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shipping-date">Data prevista de embarque</Label>
                                    <Input id="shipping-date" type="date" />
                                </div>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Condição de entrega (Incoterm)</Label>
                                    <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o Incoterm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fob">FOB</SelectItem>
                                        <SelectItem value="cif">CIF</SelectItem>
                                        <SelectItem value="exw">EXW</SelectItem>
                                        <SelectItem value="dap">DAP</SelectItem>
                                    </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Moeda da negociação</Label>
                                    <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a moeda" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usd">USD</SelectItem>
                                        <SelectItem value="eur">EUR</SelectItem>
                                    </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bl-awb">Conhecimento de embarque (BL/AWB)</Label>
                                    <Input id="bl-awb" placeholder="Número do documento" />
                                </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="local-embarque">Local de embarque</Label>
                                        <Input id="local-embarque" placeholder="Porto de Santos" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="local-destino">Local de destino</Label>
                                        <Input id="local-destino" placeholder="Port of New York" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="transportadora">Transportadora / Frete</Label>
                                    <Input id="transportadora" placeholder="Nome da transportadora" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="obs">Observações ou instruções especiais</Label>
                                    <Textarea id="obs" placeholder="Ex: Carga frágil, manusear com cuidado." />
                                </div>
                            </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                            <AccordionTrigger>3. Itens da Fatura</AccordionTrigger>
                            <AccordionContent className="space-y-4 p-1">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[30%]">Produto</TableHead>
                                            <TableHead>Qtd</TableHead>
                                            <TableHead>Unid.</TableHead>
                                            <TableHead>NCM/HS Code</TableHead>
                                            <TableHead>Valor Unit.</TableHead>
                                            <TableHead>Valor Total</TableHead>
                                            <TableHead className="w-[5%]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um produto" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cafe">Café Especial Torrado</SelectItem>
                                                    <SelectItem value="soja">Soja em Grãos</SelectItem>
                                                </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell><Input type="number" defaultValue="1000" /></TableCell>
                                            <TableCell>Kg</TableCell>
                                            <TableCell>0901.21.00</TableCell>
                                            <TableCell><Input type="number" defaultValue="20.00" /></TableCell>
                                            <TableCell className="font-medium">$ 20,000.00</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon">
                                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Button variant="outline" size="sm">
                                                    <PlusCircle className="mr-2 h-4 w-4" />
                                                    Adicionar Item
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-right">Subtotal</TableCell>
                                            <TableCell colSpan={2} className="font-medium">$ 20,000.00</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-right">Frete</TableCell>
                                            <TableCell colSpan={2}><Input className="text-right" placeholder="1,500.00" /></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-right">Seguro</TableCell>
                                            <TableCell colSpan={2}><Input className="text-right" placeholder="300.00" /></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-right">Descontos</TableCell>
                                            <TableCell colSpan={2}><Input className="text-right" placeholder="0.00" /></TableCell>
                                        </TableRow>
                                        <TableRow className="bg-muted/50">
                                            <TableCell colSpan={5} className="text-right font-bold text-lg">Total Geral (USD)</TableCell>
                                            <TableCell colSpan={2} className="font-bold text-lg">$ 21,800.00</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setActiveTab("listagem")}>Cancelar</Button>
                            <Button type="submit">Salvar Commercial Invoice</Button>
                        </div>
                        </form>
                    </CardContent>
                    </Card>
            </TabsContent>
        </Tabs>
  );
}

    