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
import { PlusCircle, MoreHorizontal, FileDown, Trash2, Edit, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Emitido':
            return 'bg-green-100 text-green-800';
        case 'Em processamento':
            return 'bg-yellow-100 text-yellow-800';
        case 'Cancelado':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function CertificadoOrigemPage() {
    const [activeTab, setActiveTab] = useState("listagem");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
                <TabsList>
                    <TabsTrigger value="listagem">Listagem</TabsTrigger>
                    <TabsTrigger value="cadastro">Novo Certificado</TabsTrigger>
                </TabsList>
                 <Button onClick={() => setActiveTab("cadastro")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Certificado
                </Button>
            </div>
            <TabsContent value="listagem">
                <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Controle de Certificados de Origem</CardTitle>
                        <CardDescription>
                        Gerencie e emita seus certificados de origem.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4">
                        <Input placeholder="Buscar por cliente ou nº do certificado..." className="md:col-span-2" />
                        <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="emitido">Emitido</SelectItem>
                            <SelectItem value="processamento">Em processamento</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input type="date" placeholder="Filtrar por data de emissão" />
                    </div>

                    <div className="border rounded-md">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Nº Certificado</TableHead>
                            <TableHead>Cliente (Importador)</TableHead>
                            <TableHead>Data de Emissão</TableHead>
                            <TableHead>País de Origem</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[5%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">CO-BR-2024-001</TableCell>
                                <TableCell>Importadora Exemplo LLC</TableCell>
                                <TableCell>15/07/2024</TableCell>
                                <TableCell>Brasil</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('Emitido')}>Emitido</Badge>
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
                            <CardTitle>Emissão de Certificado de Origem</CardTitle>
                            <CardDescription>
                            Preencha os campos para emitir um novo certificado.
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
                                        <h4 className="font-semibold">Exportador</h4>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Razão Social:</strong> Senior Assessoria em Comércio Exterior Ltda<br />
                                            <strong>Endereço:</strong> Avenida Brasil, 1234, São Paulo - SP, Brasil<br />
                                            <strong>País de Origem:</strong> Brasil
                                        </p>
                                    </div>
                                    <div className="space-y-4 p-4 border rounded-md">
                                        <h4 className="font-semibold">Importador</h4>
                                        <div className="space-y-2">
                                            <Label htmlFor="cliente">Selecione o Cliente</Label>
                                            <Select>
                                                <SelectTrigger id="cliente">
                                                    <SelectValue placeholder="Selecione um cliente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cliente1">Importadora Exemplo LLC</SelectItem>
                                                    <SelectItem value="cliente2">Global Trade Corp</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Endereço:</strong> 1234 Main Street, New York, NY, USA<br />
                                            <strong>País de Destino:</strong> Estados Unidos
                                        </p>
                                    </div>
                                </div>
                            </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-2">
                                <AccordionTrigger>2. Detalhes do Certificado</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                    <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cert-number">Número do Certificado</Label>
                                        <Input id="cert-number" value="CO-BR-2024-001" readOnly />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="invoice-ref">Fatura Comercial de Referência</Label>
                                        <Input id="invoice-ref" placeholder="CI-2024-001" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="issue-date-cert">Data de Emissão</Label>
                                        <Input id="issue-date-cert" type="date" />
                                    </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="transport-details">Detalhes do Transporte</Label>
                                        <Textarea id="transport-details" placeholder="Navio/Voo: MSC FANTASIA / V001N, Porto de embarque: Santos, Porto de destino: New York" />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>3. Descrição dos Produtos e Critério de Origem</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-2/5">Descrição do Produto</TableHead>
                                                    <TableHead>NCM/HS</TableHead>
                                                    <TableHead>Qtd e Unid.</TableHead>
                                                    <TableHead className="w-1/4">Critério de Origem</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium">Café Especial Torrado</TableCell>
                                                    <TableCell>0901.21.00</TableCell>
                                                    <TableCell>1000 Kg</TableCell>
                                                    <TableCell>
                                                        <Input placeholder="Ex: 'A', 'PE' ou 'WO'" />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                     <p className="text-xs text-muted-foreground p-1">
                                       <strong>Critérios comuns:</strong> 'A' (Totalmente Obtido), 'PE' (Produzido Exclusivamente), 'WO' (Wholly Obtained). Consulte o acordo comercial aplicável.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-4">
                                <AccordionTrigger>4. Declaração e Assinatura</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-1">
                                    <div className="space-y-2">
                                        <Label htmlFor="declaracao">Declaração</Label>
                                        <Textarea id="declaracao" rows={5} defaultValue="O abaixo assinado declara que os produtos acima descritos foram produzidos no país de origem indicado e cumprem as regras de origem especificadas no acordo comercial entre o país exportador e o país importador." />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="local-assinatura">Local e Data da Assinatura</Label>
                                            <Input id="local-assinatura" placeholder="São Paulo, 15 de Julho de 2024" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="assinatura">Anexar Assinatura</Label>
                                            <Input id="assinatura" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" type="button" onClick={() => setActiveTab("listagem")}>Cancelar</Button>
                            <Button type="submit">Salvar Certificado</Button>
                        </div>
                        </form>
                    </CardContent>
                    </Card>
            </TabsContent>
        </Tabs>
  );
}
