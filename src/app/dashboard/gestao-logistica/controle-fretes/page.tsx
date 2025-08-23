
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
import { PlusCircle, MoreHorizontal, FileDown, Trash2, Edit, Copy, Search, ThumbsUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Agendado':
            return 'bg-green-100 text-green-800';
        case 'Em cotação':
            return 'bg-yellow-100 text-yellow-800';
        case 'Concluído':
            return 'bg-blue-100 text-blue-800';
        case 'Cancelado':
             return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function ControleFretesPage() {
    const [activeTab, setActiveTab] = useState("listagem");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
                <TabsList>
                    <TabsTrigger value="listagem">Listagem de Fretes</TabsTrigger>
                    <TabsTrigger value="cadastro">Nova Cotação</TabsTrigger>
                </TabsList>
                <Button onClick={() => setActiveTab("cadastro")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Cotação de Frete
                </Button>
            </div>
            <TabsContent value="listagem">
                <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Controle de Fretes Internacionais</CardTitle>
                        <CardDescription>
                        Gerencie as cotações e agendamentos de fretes para suas operações.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4">
                        <Input placeholder="Buscar por ID, transportadora ou rota..." className="md:col-span-2" />
                        <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Filtrar por modal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="maritimo">Marítimo</SelectItem>
                                <SelectItem value="aereo">Aéreo</SelectItem>
                                <SelectItem value="rodoviario">Rodoviário</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cotacao">Em cotação</SelectItem>
                                <SelectItem value="agendado">Agendado</SelectItem>
                                <SelectItem value="concluido">Concluído</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border rounded-md">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>ID Cotação</TableHead>
                            <TableHead>Modal</TableHead>
                            <TableHead>Rota</TableHead>
                            <TableHead>Transportadora</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[5%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">FRT-001</TableCell>
                                <TableCell>Marítimo</TableCell>
                                <TableCell>Porto de Santos → Port of New York</TableCell>
                                <TableCell>Maersk Line</TableCell>
                                <TableCell>$ 1,500.00</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('Agendado')}>Agendado</Badge>
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
                                            <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Exportar Detalhes</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Cancelar Frete</DropdownMenuItem>
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
                        <CardTitle>Cotação de Frete Internacional</CardTitle>
                        <CardDescription>
                        Preencha os dados da carga e compare as propostas das transportadoras.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-8">
                        <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']}>

                            <AccordionItem value="item-1">
                                <AccordionTrigger>1. Detalhes da Rota e Carga</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Modal de Transporte</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o modal" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="maritimo">Marítimo</SelectItem>
                                                    <SelectItem value="aereo">Aéreo</SelectItem>
                                                    <SelectItem value="rodoviario">Rodoviário</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="fatura-ref">Pedido / Fatura de Referência</Label>
                                            <Input id="fatura-ref" placeholder="PED-001 / CI-2024-001" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="local-origem">Local de Origem</Label>
                                            <Input id="local-origem" placeholder="Porto de Santos, Brasil" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="local-destino">Local de Destino</Label>
                                            <Input id="local-destino" placeholder="Port of New York, USA" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="descricao-carga">Descrição da Carga</Label>
                                        <Textarea id="descricao-carga" placeholder="Ex: 1 Contêiner 20' ST contendo 1000 caixas de café." />
                                    </div>
                                     <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="peso-bruto">Peso Bruto (kg)</Label>
                                            <Input id="peso-bruto" type="number" placeholder="22000" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="volume-cbm">Volume (CBM)</Label>
                                            <Input id="volume-cbm" type="number" placeholder="30" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="data-prontidao">Data de Prontidão da Carga</Label>
                                            <Input id="data-prontidao" type="date" />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="item-2">
                                <AccordionTrigger>2. Cotações Recebidas</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[30%]">Transportadora</TableHead>
                                                    <TableHead>Valor (USD)</TableHead>
                                                    <TableHead>Prazo Trânsito</TableHead>
                                                    <TableHead>Validade</TableHead>
                                                    <TableHead className="w-[10%]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><Input placeholder="Maersk Line" /></TableCell>
                                                    <TableCell><Input type="number" placeholder="1500.00" className="w-28"/></TableCell>
                                                    <TableCell><Input placeholder="21 dias" className="w-24"/></TableCell>
                                                    <TableCell><Input type="date" /></TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon">
                                                            <ThumbsUp className="h-4 w-4 text-green-600"/>
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow className="bg-green-50">
                                                    <TableCell><Input placeholder="MSC" defaultValue="MSC"/></TableCell>
                                                    <TableCell><Input type="number" placeholder="1450.00" defaultValue="1450.00" className="w-28"/></TableCell>
                                                    <TableCell><Input placeholder="23 dias" defaultValue="23 dias" className="w-24"/></TableCell>
                                                    <TableCell><Input type="date" /></TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="secondary" size="icon" className="bg-green-200 hover:bg-green-300">
                                                            <ThumbsUp className="h-4 w-4 text-green-800"/>
                                                        </Button>
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
                                        Adicionar Cotação
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <AccordionTrigger>3. Decisão e Status</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Transportadora Escolhida</Label>
                                            <Input readOnly value="MSC" className="font-semibold"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="booking-number">Nº do Booking / Reserva</Label>
                                            <Input id="booking-number" placeholder="BK12345678" />
                                        </div>
                                    </div>
                                     <div className="space-y-2">
                                        <Label>Status do Frete</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cotacao">Em cotação</SelectItem>
                                                <SelectItem value="agendado">Agendado</SelectItem>
                                                <SelectItem value="concluido">Concluído</SelectItem>
                                                <SelectItem value="cancelado">Cancelado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="observacoes-frete">Observações Internas</Label>
                                        <Textarea id="observacoes-frete" placeholder="Anotações sobre a negociação, contato na transportadora, etc." />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setActiveTab("listagem")}>Cancelar</Button>
                            <Button type="submit">Salvar Cotação</Button>
                        </div>
                        </form>
                    </CardContent>
                    </Card>
            </TabsContent>
        </Tabs>
    );
}

    