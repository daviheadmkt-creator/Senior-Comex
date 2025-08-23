
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MoreHorizontal, PlusCircle, Trash2, Edit, Eye, User, Building, Phone, Mail, Globe, Briefcase, FileText, Banknote, Ship, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const clientes = [
    {
        id: 'importadora-exemplo-llc',
        nome: 'Importadora Exemplo LLC',
        pais: 'Estados Unidos',
        contato: 'John Doe',
        status: 'Ativo',
        taxId: '98-7654321',
        endereco: '1234 Main Street, Apt 4B, New York, NY 10001',
        email: 'john.doe@example.com',
        telefone: '+1 (212) 555-1234',
        tipo: 'Distribuidor',
        setor: 'Alimentos e Bebidas',
        incoterm: 'FOB (Free On Board)',
        condicaoPagamento: '30 dias',
        portalLink: '/dashboard/cadastros/clientes/importadora-exemplo-llc'
    },
    {
        id: 'global-trade-corp',
        nome: 'Global Trade Corp',
        pais: 'Argentina',
        contato: 'Maria Garcia',
        status: 'Ativo',
        taxId: '20-12345678-9',
        endereco: 'Av. Corrientes 123, Buenos Aires, C1043AAS',
        email: 'maria.garcia@globaltrade.com.ar',
        telefone: '+54 11 4321-9876',
        tipo: 'Atacadista',
        setor: 'Commodities',
        incoterm: 'CIF (Cost, Insurance and Freight)',
        condicaoPagamento: 'Carta de Crédito (L/C)',
        portalLink: '/dashboard/cadastros/clientes/global-trade-corp'
    },
    {
        id: 'euro-importers',
        nome: 'Euro Importers',
        pais: 'Alemanha',
        contato: 'Hans Müller',
        status: 'Inativo',
        taxId: 'DE123456789',
        endereco: 'Musterstraße 1, 10117 Berlin',
        email: 'hans.muller@euroimporters.de',
        telefone: '+49 30 1234567',
        tipo: 'Varejista',
        setor: 'Manufaturados',
        incoterm: 'EXW (Ex Works)',
        condicaoPagamento: '60 dias',
        portalLink: '/dashboard/cadastros/clientes/euro-importers'
    },
     {
        id: 'asian-buyers-co',
        nome: 'Asian Buyers Co.',
        pais: 'Japão',
        contato: 'Yuki Tanaka',
        status: 'Em prospecção',
        taxId: '123-456-789',
        endereco: '1-1-2 Otemachi, Chiyoda-ku, Tokyo 100-8111',
        email: 'y.tanaka@asianbuyers.jp',
        telefone: '+81 3-1234-5678',
        tipo: 'Consumidor final',
        setor: 'Eletrônicos',
        incoterm: 'FOB (Free On Board)',
        condicaoPagamento: 'Antecipado',
        portalLink: '/dashboard/cadastros/clientes/asian-buyers-co'
    }
];

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Ativo':
            return 'bg-green-100 text-green-800';
        case 'Inativo':
            return 'bg-gray-100 text-gray-800';
        case 'Em prospecção':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return '';
    }
}


export default function ClientesInternacionaisPage() {
    const [activeTab, setActiveTab] = useState("listagem");
    const [selectedClient, setSelectedClient] = useState<(typeof clientes)[0] | null>(null);


    return (
     <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
            <TabsTrigger value="listagem">Clientes Cadastrados</TabsTrigger>
            <TabsTrigger value="cadastro">Adicionar Cliente</TabsTrigger>
        </TabsList>
        <Button onClick={() => setActiveTab("cadastro")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Cliente
        </Button>
      </div>
      <TabsContent value="listagem">
         <Card>
            <CardHeader>
                <CardTitle>Clientes Internacionais</CardTitle>
                <CardDescription>
                Visualize e gerencie os clientes importadores cadastrados.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome da Empresa</TableHead>
                                <TableHead>País</TableHead>
                                <TableHead>Contato Principal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[15%] text-center">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientes.map((cliente) => (
                                <TableRow key={cliente.id}>
                                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                                    <TableCell>{cliente.pais}</TableCell>
                                    <TableCell>{cliente.contato}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusClass(cliente.status)}>{cliente.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                     <Button variant="outline" size="icon" className="h-8 w-8 bg-blue-100/60 text-blue-600 border-blue-200/70 hover:bg-blue-100 hover:text-blue-700">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[625px]">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2"> <Building className="h-5 w-5 text-primary" /> {cliente.nome}</DialogTitle>
                                                        <DialogDescription>{cliente.taxId} - {cliente.endereco}</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <Card>
                                                                <CardHeader className="p-3">
                                                                    <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Contato</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="p-3 text-sm">
                                                                    <p><strong>Responsável:</strong> {cliente.contato}</p>
                                                                    <p><strong>E-mail:</strong> {cliente.email}</p>
                                                                    <p><strong>Telefone:</strong> {cliente.telefone}</p>
                                                                </CardContent>
                                                            </Card>
                                                             <Card>
                                                                <CardHeader className="p-3">
                                                                    <CardTitle className="text-base flex items-center gap-2"><Briefcase className="h-4 w-4" /> Comercial</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="p-3 text-sm">
                                                                    <p><strong>Tipo:</strong> {cliente.tipo}</p>
                                                                    <p><strong>Setor:</strong> {cliente.setor}</p>
                                                                    <p><strong>Incoterm:</strong> {cliente.incoterm}</p>
                                                                    <p><strong>Pagamento:</strong> {cliente.condicaoPagamento}</p>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                        <Button asChild variant="outline">
                                                            <Link href={cliente.portalLink}>Acessar Portal do Cliente</Link>
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Button variant="outline" size="icon" className="h-8 w-8 bg-green-100/60 text-green-600 border-green-200/70 hover:bg-green-100 hover:text-green-700">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                             <Button variant="outline" size="icon" className="h-8 w-8 bg-red-100/60 text-red-600 border-red-200/70 hover:bg-red-100 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
            <CardTitle>Cadastro de Clientes Internacionais</CardTitle>
            <CardDescription>
            Preencha os campos abaixo para cadastrar um novo cliente importador.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form className="space-y-8">
            <Accordion type="multiple" defaultValue={['item-1']}>
                <AccordionItem value="item-1">
                <AccordionTrigger>1. Dados Gerais</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome-empresa">Nome da empresa (importador)</Label>
                        <Input id="nome-empresa" placeholder="Nome da Empresa Importadora" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nome-fantasia">Nome fantasia</Label>
                        <Input id="nome-fantasia" placeholder="Nome Fantasia (se houver)" />
                    </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="tax-id">Registro fiscal (Tax ID / VAT / etc.)</Label>
                    <Input id="tax-id" placeholder="Número de registro fiscal" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="logradouro">Endereço (Rua / Avenida)</Label>
                    <Input id="logradouro" placeholder="1234 Main Street" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input id="numero" placeholder="Apt 4B" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input id="cidade" placeholder="New York" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cep">CEP / Código postal</Label>
                        <Input id="cep" placeholder="10001" />
                    </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado / Província</Label>
                        <Input id="estado" placeholder="NY" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pais">País</Label>
                        <Input id="pais" placeholder="United States" />
                    </div>
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                <AccordionTrigger>2. Dados de Contato</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="responsavel">Nome do responsável principal</Label>
                        <Input id="responsavel" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo / função</Label>
                        <Input id="cargo" placeholder="Purchasing Manager" />
                    </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email-contato">E-mail principal</Label>
                        <Input
                        id="email-contato"
                        type="email"
                        placeholder="john.doe@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telefone-fixo">Telefone fixo</Label>
                        <Input id="telefone-fixo" placeholder="+1 (212) 555-1234" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp / Celular</Label>
                        <Input id="whatsapp" placeholder="+1 (917) 555-5678" />
                    </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Outros contatos</Label>
                        <Textarea placeholder="Compras: purchase@example.com, Logística: logistics@example.com..." />
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                <AccordionTrigger>3. Informações Comerciais</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label>Tipo de cliente</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="distribuidor">Distribuidor</SelectItem>
                                <SelectItem value="atacadista">Atacadista</SelectItem>
                                <SelectItem value="varejista">Varejista</SelectItem>
                                <SelectItem value="consumidor-final">Consumidor final</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="setor">Setor de atuação</Label>
                        <Input id="setor" placeholder="Alimentos e Bebidas" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="produtos-comprados">Produtos comprados regularmente</Label>
                        <Textarea id="produtos-comprados" placeholder="Café (Grãos), Soja, Açúcar..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="historico-pedidos">Histórico de pedidos (volume e frequência)</Label>
                        <Textarea id="historico-pedidos" placeholder="Média de 2 containers/mês..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="limite-credito">Limite de crédito (quando aplicável)</Label>
                        <Input id="limite-credito" type="number" placeholder="50000" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Condições de pagamento negociadas</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a condição" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="antecipado">Antecipado</SelectItem>
                                    <SelectItem value="30-dias">30 dias</SelectItem>
                                    <SelectItem value="60-dias">60 dias</SelectItem>
                                    <SelectItem value="90-dias">90 dias</SelectItem>
                                    <SelectItem value="carta-credito">Carta de Crédito (L/C)</SelectItem>
                                    <SelectItem value="cad">Cobrança à vista (CAD)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Incoterms utilizados</Label>
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
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                <AccordionTrigger>4. Informações de Exportação</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="portos-destino">Portos/aeroportos de destino</Label>
                            <Input id="portos-destino" placeholder="Port of New York, JFK Airport" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agentes-carga">Transportadoras/agentes de carga</Label>
                            <Input id="agentes-carga" placeholder="DHL, Kuehne+Nagel" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="certificados">Necessidade de certificados</Label>
                        <Textarea id="certificados" placeholder="Certificado Fitossanitário, Certificado de Origem (Form A)..." />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="idioma-docs">Idioma para documentos</Label>
                            <Input id="idioma-docs" placeholder="Inglês" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="moeda-pref">Moeda preferencial</Label>
                            <Input id="moeda-pref" placeholder="USD" />
                        </div>
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                <AccordionTrigger>5. Financeiro</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="banco-cliente">Banco do cliente</Label>
                            <Input id="banco-cliente" placeholder="Citibank" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="swift-iban">SWIFT / IBAN</Label>
                            <Input id="swift-iban" placeholder="CITIUS33XXX" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pais-banco">País do banco</Label>
                            <Input id="pais-banco" placeholder="United States" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="obs-pagamentos">Observações sobre pagamentos</Label>
                        <Textarea id="obs-pagamentos" placeholder="Cliente costuma pagar pontualmente..." />
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                <AccordionTrigger>6. Documentação e Compliance</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="space-y-2">
                        <Label htmlFor="contrato-comercial">Contratos comerciais</Label>
                        <Input id="contrato-comercial" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="certificados-exigidos">Certificados exigidos</Label>
                        <Input id="certificados-exigidos" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="doc-homologacao">Documentos de homologação</Label>
                        <Input id="doc-homologacao" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="verificacao-sancoes">Verificação de sanções internacionais</Label>
                        <Textarea id="verificacao-sancoes" placeholder="Resultado da verificação em listas de sanções (ex: OFAC)..." />
                    </div>
                    <Button variant="outline" size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Outro Documento
                    </Button>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                <AccordionTrigger>7. Configurações do Sistema</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <RadioGroup defaultValue="ativo" className="flex items-center gap-6 pt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ativo" id="r1" />
                                <Label htmlFor="r1">Ativo</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="inativo" id="r2" />
                                <Label htmlFor="r2">Inativo</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="prospeccao" id="r3" />
                                <Label htmlFor="r3">Em prospecção</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="usuario-responsavel">Usuário interno responsável</Label>
                        <Input id="usuario-responsavel" placeholder="Vincular usuário (ex: admin, operador)" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="observacoes">Observações internas</Label>
                        <Textarea id="observacoes" placeholder="Anotações importantes sobre o cliente..." />
                    </div>
                </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setActiveTab("listagem")}>Cancelar</Button>
                <Button type="submit">Salvar Cadastro</Button>
            </div>
            </form>
        </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
