
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
import { PlusCircle, MoreHorizontal, FileDown, Trash2, Edit, Copy, Link, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Registrada':
            return 'bg-green-100 text-green-800';
        case 'Em Processamento':
            return 'bg-yellow-100 text-yellow-800';
        case 'Cancelada':
            return 'bg-gray-100 text-gray-800';
        case 'Averbada':
             return 'bg-blue-100 text-blue-800';
        default:
            return '';
    }
}


export default function DuePage() {
    const [activeTab, setActiveTab] = useState("listagem");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
                <TabsList>
                    <TabsTrigger value="listagem">Listagem de DU-E</TabsTrigger>
                    <TabsTrigger value="cadastro">Nova DU-E</TabsTrigger>
                </TabsList>
                 <Button onClick={() => setActiveTab("cadastro")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova DU-E
                </Button>
            </div>
            <TabsContent value="listagem">
                <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Controle de Declarações Únicas de Exportação (DU-E)</CardTitle>
                        <CardDescription>
                         Gerencie, emita e acompanhe suas DU-Es junto ao Portal Siscomex.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4">
                        <Input placeholder="Buscar por RUC, Nº DU-E ou NFe..." className="md:col-span-2" />
                        <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="averbada">Averbada</SelectItem>
                                <SelectItem value="registrada">Registrada</SelectItem>
                                <SelectItem value="processamento">Em Processamento</SelectItem>
                                <SelectItem value="cancelada">Cancelada</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Search className="mr-2 h-4 w-4" />
                            Filtrar
                        </Button>
                    </div>

                    <div className="border rounded-md">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>RUC</TableHead>
                            <TableHead>Nº DU-E</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Canal</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[5%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">24BR0001234567</TableCell>
                                <TableCell>24BR1234567890</TableCell>
                                <TableCell>20/07/2024</TableCell>
                                <TableCell>Verde</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('Averbada')}>Averbada</Badge>
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
                                            <DropdownMenuItem><Link className="mr-2 h-4 w-4" /> Acessar no Siscomex</DropdownMenuItem>
                                            <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Baixar Extrato</DropdownMenuItem>
                                            <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicar</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Retificar / Cancelar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium">24BR0007654321</TableCell>
                                <TableCell>24BR0987654321</TableCell>
                                <TableCell>22/07/2024</TableCell>
                                <TableCell>Laranja</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('Registrada')}>Registrada</Badge>
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
                                            <DropdownMenuItem><Link className="mr-2 h-4 w-4" /> Acessar no Siscomex</DropdownMenuItem>
                                            <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Baixar Extrato</DropdownMenuItem>
                                            <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicar</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Retificar / Cancelar</DropdownMenuItem>
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
                            <CardTitle>Elaboração de DU-E</CardTitle>
                            <CardDescription>
                            Preencha os campos para elaborar uma nova Declaração Única de Exportação.
                            </CardDescription>
                        </div>
                        <Button>
                            <FileUp className="mr-2 h-4 w-4" />
                            Registrar no Siscomex
                        </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-8">
                        <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']}>

                            <AccordionItem value="item-1">
                                <AccordionTrigger>1. Informações Gerais</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                    <div className="grid md:grid-cols-2 gap-4">
                                         <div className="space-y-2">
                                            <Label htmlFor="ruc">RUC (Referência Única de Carga)</Label>
                                            <Input id="ruc" placeholder="Preenchido após o registro" readOnly />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="due-number">Nº da DU-E</Label>
                                            <Input id="due-number" placeholder="Preenchido após o registro" readOnly />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm">Declarante (Sua Empresa)</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Senior Assessoria em Comércio Exterior Ltda<br />
                                                CNPJ: 00.123.456/0001-00
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm">Exportador</h4>
                                             <p className="text-sm text-muted-foreground">
                                                Senior Assessoria em Comércio Exterior Ltda<br />
                                                CNPJ: 00.123.456/0001-00
                                            </p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="item-2">
                                <AccordionTrigger>2. Itens da DU-E (Baseado em Notas Fiscais)</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                     <div className="space-y-2">
                                        <Label htmlFor="nfe-key">Chave de Acesso da NF-e</Label>
                                        <div className="flex gap-2">
                                            <Input id="nfe-key" placeholder="Insira a chave de 44 dígitos da nota fiscal de exportação" />
                                            <Button type="button" variant="secondary">Adicionar NF-e</Button>
                                        </div>
                                    </div>
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Item</TableHead>
                                                    <TableHead>NCM</TableHead>
                                                    <TableHead>Descrição</TableHead>
                                                    <TableHead>VMLE (USD)</TableHead>
                                                    <TableHead>Peso Líquido (kg)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>1</TableCell>
                                                    <TableCell>0901.21.00</TableCell>
                                                    <TableCell>Café Especial Torrado</TableCell>
                                                    <TableCell>$ 20,000.00</TableCell>
                                                    <TableCell>1000.00</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                     <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox id="sem-nfe" />
                                        <Label htmlFor="sem-nfe" className="text-sm font-normal">
                                            Operação sem nota fiscal (ex: exportação temporária).
                                        </Label>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <AccordionTrigger>3. Informações Adicionais</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Moeda da Negociação</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a moeda" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="usd">USD - Dólar Americano</SelectItem>
                                                    <SelectItem value="eur">EUR - Euro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                         <div className="space-y-2">
                                            <Label>Incoterm</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o Incoterm" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fob">FOB</SelectItem>
                                                    <SelectItem value="cif">CIF</SelectItem>
                                                    <SelectItem value="exw">EXW</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="info-complementar">Informações Complementares</Label>
                                        <Textarea id="info-complementar" placeholder="Detalhes relevantes para o despacho aduaneiro." />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setActiveTab("listagem")}>Cancelar</Button>
                            <Button type="submit">Salvar Rascunho</Button>
                        </div>
                        </form>
                    </CardContent>
                    </Card>
            </TabsContent>
        </Tabs>
  );
}
