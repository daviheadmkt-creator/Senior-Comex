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
        case 'Finalizado':
            return 'bg-green-100 text-green-800';
        case 'Em elaboração':
            return 'bg-yellow-100 text-yellow-800';
        case 'Cancelado':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function PackingListPage() {
    const [activeTab, setActiveTab] = useState("listagem");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
                <TabsList>
                    <TabsTrigger value="listagem">Listagem</TabsTrigger>
                    <TabsTrigger value="cadastro">Novo Packing List</TabsTrigger>
                </TabsList>
                 <Button onClick={() => setActiveTab("cadastro")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Packing List
                </Button>
            </div>
            <TabsContent value="listagem">
                <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Controle de Packing Lists (Romaneios de Carga)</CardTitle>
                        <CardDescription>
                        Gerencie e emita seus romaneios de carga.
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
                                <SelectItem value="elaboracao">Em elaboração</SelectItem>
                                <SelectItem value="finalizado">Finalizado</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input type="date" placeholder="Filtrar por data de emissão" />
                    </div>

                    <div className="border rounded-md">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nº Packing List</TableHead>
                            <TableHead>Fatura Ref.</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Volumes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[5%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">PL-2024-001</TableCell>
                                <TableCell>CI-2024-001</TableCell>
                                <TableCell>Importadora Exemplo LLC</TableCell>
                                <TableCell>15/07/2024</TableCell>
                                <TableCell>10</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('Finalizado')}>Finalizado</Badge>
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
                                            <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicar</DropdownMenuItem>
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
                            <CardTitle>Emissão de Packing List</CardTitle>
                            <CardDescription>
                            Preencha os campos para criar um novo romaneio de carga.
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
                                <AccordionTrigger>1. Informações Gerais</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pl-number">Nº do Packing List</Label>
                                            <Input id="pl-number" value="PL-2024-001" readOnly />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="invoice-ref">Fatura Comercial de Referência</Label>
                                            <Input id="invoice-ref" placeholder="CI-2024-001" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="issue-date-pl">Data de Emissão</Label>
                                            <Input id="issue-date-pl" type="date" />
                                        </div>
                                    </div>
                                     <div className="grid md:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm">Exportador</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Senior Assessoria em Comércio Exterior Ltda<br />
                                                Avenida Brasil, 1234, São Paulo - SP, Brasil
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm">Importador</h4>
                                             <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um cliente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cliente1">Importadora Exemplo LLC</SelectItem>
                                                    <SelectItem value="cliente2">Global Trade Corp</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="item-2">
                                <AccordionTrigger>2. Detalhes dos Volumes</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Volume Nº</TableHead>
                                                    <TableHead>Descrição do Conteúdo</TableHead>
                                                    <TableHead>Qtd</TableHead>
                                                    <TableHead>Peso Líquido (kg)</TableHead>
                                                    <TableHead>Peso Bruto (kg)</TableHead>
                                                    <TableHead>Dimensões (cm)</TableHead>
                                                    <TableHead className="w-[5%]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><Input placeholder="1" className="w-16"/></TableCell>
                                                    <TableCell><Textarea placeholder="Caixa contendo café especial..." rows={1} /></TableCell>
                                                    <TableCell><Input type="number" placeholder="50" className="w-20"/></TableCell>
                                                    <TableCell><Input type="number" placeholder="50.0" className="w-24"/></TableCell>
                                                    <TableCell><Input type="number" placeholder="51.5" className="w-24"/></TableCell>
                                                    <TableCell><Input placeholder="30x20x10" className="w-28"/></TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Adicionar Volume
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <AccordionTrigger>3. Totais e Observações</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                    <Card className="bg-muted/50">
                                        <CardContent className="p-4">
                                             <Table>
                                                <TableBody>
                                                    <TableRow className="border-0">
                                                        <TableCell className="font-medium">Total de Volumes:</TableCell>
                                                        <TableCell className="text-right">1</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Peso Líquido Total:</TableCell>
                                                        <TableCell className="text-right">50.0 kg</TableCell>
                                                    </TableRow>
                                                     <TableRow>
                                                        <TableCell className="font-medium">Peso Bruto Total:</TableCell>
                                                        <TableCell className="text-right">51.5 kg</TableCell>
                                                    </TableRow>
                                                     <TableRow>
                                                        <TableCell className="font-medium">Volume Total (m³):</TableCell>
                                                        <TableCell className="text-right">0.15 m³</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                             </Table>
                                        </CardContent>
                                    </Card>
                                     <div className="space-y-2">
                                        <Label htmlFor="obs-packing">Observações Adicionais</Label>
                                        <Textarea id="obs-packing" placeholder="Ex: Carga paletizada. Manusear com cuidado." />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setActiveTab("listagem")}>Cancelar</Button>
                            <Button type="submit">Salvar Packing List</Button>
                        </div>
                        </form>
                    </CardContent>
                    </Card>
            </TabsContent>
        </Tabs>
  );
}

    