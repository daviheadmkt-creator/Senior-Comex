
'use client';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
} from '@/components/ui/table';
import { PlusCircle, Trash2, FileDown, MoreHorizontal, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const proformas = [
    {
        numero: 'PI-2024-001',
        cliente: 'Importadora Exemplo LLC',
        data: '10/07/2024',
        valor: '$ 21,800.00',
        status: 'Aceito'
    },
    {
        numero: 'PI-2024-002',
        cliente: 'Global Trade Corp',
        data: '15/07/2024',
        valor: '$ 5,400.00',
        status: 'Enviado'
    },
    {
        numero: 'PI-2024-003',
        cliente: 'Euro Importers',
        data: '20/07/2024',
        valor: '€ 12,000.00',
        status: 'Cancelado'
    }
];


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Aceito':
            return 'bg-green-100 text-green-800';
        case 'Enviado':
            return 'bg-blue-100 text-blue-800';
        case 'Cancelado':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function ProformaInvoicePage() {
  const [activeTab, setActiveTab] = useState("listagem");

  return (
     <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
            <TabsTrigger value="listagem">Proformas Emitidas</TabsTrigger>
            <TabsTrigger value="cadastro">Emitir Proforma</TabsTrigger>
        </TabsList>
        <Button onClick={() => setActiveTab("cadastro")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Emitir Proforma
        </Button>
      </div>
      <TabsContent value="listagem">
         <Card>
            <CardHeader>
                <CardTitle>Controle de Proforma Invoices</CardTitle>
                <CardDescription>
                Visualize e gerencie as cotações internacionais emitidas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Número</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Data Emissão</TableHead>
                                <TableHead>Valor Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[10%] text-center">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {proformas.map((proforma) => (
                                <TableRow key={proforma.numero}>
                                    <TableCell className="font-medium">{proforma.numero}</TableCell>
                                    <TableCell>{proforma.cliente}</TableCell>
                                    <TableCell>{proforma.data}</TableCell>
                                    <TableCell>{proforma.valor}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusClass(proforma.status)}>{proforma.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Ver / Editar</DropdownMenuItem>
                                                <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Gerar PDF</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Cancelar</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
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
                <CardTitle>Emissão de Proforma Invoice</CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para gerar uma nova cotação internacional.
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
              <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5']}>
                <AccordionItem value="item-1">
                  <AccordionTrigger>1. Dados Gerais</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="proforma-number">Número da Proforma</Label>
                        <Input id="proforma-number" value="PI-2024-001" readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emission-date">Data de emissão</Label>
                        <Input id="emission-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="validity-date">Validade da proposta</Label>
                        <Input id="validity-date" type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                          <Label>Status</Label>
                          <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="elaboracao">Em elaboração</SelectItem>
                                <SelectItem value="enviado">Enviado</SelectItem>
                                <SelectItem value="aceito">Aceito</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>2. Informações do Exportador e Importador</AccordionTrigger>
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

                <AccordionItem value="item-3">
                  <AccordionTrigger>3. Informações Comerciais</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Condições de venda (Incoterm)</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o Incoterm" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fob">FOB (Free On Board)</SelectItem>
                            <SelectItem value="cif">CIF (Cost, Insurance and Freight)</SelectItem>
                            <SelectItem value="exw">EXW (Ex Works)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Modal de transporte</Label>
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
                        <Label>Moeda da negociação</Label>
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
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="porto-embarque">Porto/aeroporto de embarque</Label>
                            <Input id="porto-embarque" placeholder="Porto de Santos" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="porto-destino">Porto/aeroporto de destino</Label>
                            <Input id="porto-destino" placeholder="Port of New York" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Condições de pagamento</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a condição de pagamento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="antecipado">Antecipado</SelectItem>
                                <SelectItem value="30-dias">30 dias</SelectItem>
                                <SelectItem value="60-dias">60 dias</SelectItem>
                                <SelectItem value="carta-credito">Carta de Crédito (L/C)</SelectItem>
                                <SelectItem value="cad">Cobrança à vista (CAD)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>4. Itens da Proforma</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-1">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Produto</TableHead>
                                <TableHead>Qtd</TableHead>
                                <TableHead>Unid.</TableHead>
                                <TableHead>Valor Unitário</TableHead>
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
                                        <SelectItem value="cafe">Café Especial Torrado (SKU-12345)</SelectItem>
                                        <SelectItem value="soja">Soja em Grãos (SKU-67890)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell><Input type="number" defaultValue="1000" /></TableCell>
                                <TableCell>Kg</TableCell>
                                <TableCell><Input type="number" defaultValue="20.00" /></TableCell>
                                <TableCell className="font-medium">$ 20.000,00</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Button variant="outline" size="sm">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Adicionar Item
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} className="text-right">Subtotal</TableCell>
                                <TableCell colSpan={2} className="font-medium">$ 20.000,00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} className="text-right">Frete</TableCell>
                                <TableCell colSpan={2}><Input className="text-right" defaultValue="1.500,00" /></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} className="text-right">Seguro</TableCell>
                                <TableCell colSpan={2}><Input className="text-right" defaultValue="300,00" /></TableCell>
                            </TableRow>
                            <TableRow className="bg-muted/50">
                                <TableCell colSpan={4} className="text-right font-bold text-lg">Total Geral (USD)</TableCell>
                                <TableCell colSpan={2} className="font-bold text-lg">$ 21.800,00</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>5. Observações e Documentos</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-1">
                    <div className="space-y-2">
                        <Label htmlFor="obs-comerciais">Observações comerciais</Label>
                        <Textarea id="obs-comerciais" placeholder="Ex: Prazo de produção: 15 dias úteis. Certificados acompanham a carga." />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="obs-internas">Observações internas (visível apenas para a equipe)</Label>
                        <Textarea id="obs-internas" placeholder="Ex: Negociar frete com a transportadora X." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="anexos">Documentos Anexos</Label>
                        <Input id="anexos" type="file" multiple className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setActiveTab('listagem')}>Cancelar</Button>
                <Button type="submit">Salvar Proforma</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
