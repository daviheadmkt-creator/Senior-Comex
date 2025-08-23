
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
import { FileUp, PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const empresas = [
    {
        razaoSocial: 'Senior Assessoria em Comércio Exterior Ltda',
        cnpj: '00.123.456/0001-00',
        cidade: 'São Paulo',
        uf: 'SP',
        status: 'Ativa'
    },
    {
        razaoSocial: 'Fornecedor Nacional Exemplo',
        cnpj: '11.222.333/0001-44',
        cidade: 'Curitiba',
        uf: 'PR',
        status: 'Ativa'
    },
     {
        razaoSocial: 'Empresa Inativa Teste',
        cnpj: '99.888.777/0001-66',
        cidade: 'Rio de Janeiro',
        uf: 'RJ',
        status: 'Inativa'
    }
]

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Ativa':
            return 'bg-green-100 text-green-800';
        case 'Inativa':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function EmpresaPage() {
  const [activeTab, setActiveTab] = useState("listagem");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
            <TabsTrigger value="listagem">Empresas Cadastradas</TabsTrigger>
            <TabsTrigger value="cadastro">Adicionar Empresa</TabsTrigger>
        </TabsList>
        <Button onClick={() => setActiveTab("cadastro")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Empresa
        </Button>
      </div>

      <TabsContent value="listagem">
         <Card>
            <CardHeader>
                <CardTitle>Empresas Nacionais</CardTitle>
                <CardDescription>
                Visualize e gerencie as empresas cadastradas no sistema.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Razão Social</TableHead>
                                <TableHead>CNPJ</TableHead>
                                <TableHead>Cidade/UF</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[5%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {empresas.map((empresa) => (
                                <TableRow key={empresa.cnpj}>
                                    <TableCell className="font-medium">{empresa.razaoSocial}</TableCell>
                                    <TableCell>{empresa.cnpj}</TableCell>
                                    <TableCell>{empresa.cidade}/{empresa.uf}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusClass(empresa.status)}>{empresa.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
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
            <CardTitle>Cadastro de Empresas Nacionais</CardTitle>
            <CardDescription>
            Preencha os campos abaixo para cadastrar uma nova empresa.
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
                        <Label htmlFor="nome-empresa">Nome da empresa</Label>
                        <Input id="nome-empresa" placeholder="Nome Fantasia" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="razao-social">Razão social</Label>
                        <Input id="razao-social" placeholder="Razão Social Ltda." />
                    </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cnpj-cpf">CNPJ / CPF</Label>
                        <Input id="cnpj-cpf" placeholder="00.000.000/0001-00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="inscricao-estadual">
                        Inscrição estadual / municipal
                        </Label>
                        <Input id="inscricao-estadual" placeholder="123.456.789.112" />
                    </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="logradouro">Endereço</Label>
                    <Input id="logradouro" placeholder="Avenida Brasil" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input id="numero" placeholder="1234" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input id="bairro" placeholder="Centro" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input id="cep" placeholder="12345-678" />
                    </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input id="cidade" placeholder="São Paulo" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Input id="estado" placeholder="SP" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pais">País</Label>
                        <Input id="pais" defaultValue="Brasil" />
                    </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone(s)</Label>
                        <Input id="telefone" placeholder="(11) 98765-4321" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail principal</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="contato@empresa.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="site">Site</Label>
                        <Input
                        id="site"
                        type="url"
                        placeholder="https://suaempresa.com"
                        />
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
                        <Input id="responsavel" placeholder="Nome Completo" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo / função</Label>
                        <Input id="cargo" placeholder="Diretor Comercial" />
                    </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email-contato">E-mail de contato</Label>
                        <Input
                        id="email-contato"
                        type="email"
                        placeholder="responsavel@empresa.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telefone-contato">Telefone / WhatsApp</Label>
                        <Input id="telefone-contato" placeholder="(11) 91234-5678" />
                    </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Outros contatos</Label>
                        <Textarea placeholder="Comercial: comercial@empresa.com, Financeiro: financeiro@empresa.com..." />
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                <AccordionTrigger>3. Informações de Exportação</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="radar">Número do RADAR / Habilitação no Siscomex</Label>
                        <Input id="radar" placeholder="Número do RADAR" />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="cod-exportador">Código do Exportador (quando aplicável)</Label>
                        <Input id="cod-exportador" placeholder="Código" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paises-autorizados">Países autorizados para exportação</Label>
                        <Input id="paises-autorizados" placeholder="Argentina, Estados Unidos, China..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="portos-preferenciais">Portos/Aeroportos de embarque preferenciais</Label>
                        <Input id="portos-preferenciais" placeholder="Porto de Santos, Aeroporto de Guarulhos..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="parceiros-logisticos">Transportadoras/parceiros logísticos cadastrados</Label>
                        <Input id="parceiros-logisticos" placeholder="DHL, FedEx, Maersk..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="regimes-aduaneiros">Regimes aduaneiros utilizados</Label>
                        <Input id="regimes-aduaneiros" placeholder="Exportação Temporária, Drawback" />
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                <AccordionTrigger>4. Dados Financeiros</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="banco-principal">Banco principal</Label>
                            <Input id="banco-principal" placeholder="Nome do banco" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agencia">Agência</Label>
                            <Input id="agencia" placeholder="0001" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="conta">Conta</Label>
                            <Input id="conta" placeholder="12345-6" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="moedas-aceitas">Moedas aceitas para pagamento</Label>
                        <Input id="moedas-aceitas" placeholder="USD, EUR, BRL" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="condicoes-pagamento">Condições de pagamento</Label>
                        <Select>
                            <SelectTrigger id="condicoes-pagamento">
                                <SelectValue placeholder="Selecione uma condição" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="antecipado">Antecipado</SelectItem>
                                <SelectItem value="carta-credito">Carta de Crédito (L/C)</SelectItem>
                                <SelectItem value="cobranca-documentaria">Cobrança Documentária</SelectItem>
                                <SelectItem value="30-dias">30 dias</SelectItem>
                                <SelectItem value="60-dias">60 dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contratos-cambio">Dados de contratos de câmbio anteriores</Label>
                        <Textarea id="contratos-cambio" placeholder="Contrato #123 - Banco XYZ..." />
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                <AccordionTrigger>5. Documentação</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <p className="text-sm text-muted-foreground">Anexe os documentos relevantes da empresa.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contrato-social">Contrato social / Estatuto</Label>
                            <Input id="contrato-social" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="certidoes">Certidões</Label>
                            <Input id="certidoes" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="licencas">Licenças e autorizações</Label>
                            <Input id="licencas" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="certificado-origem">Certificado de origem</Label>
                            <Input id="certificado-origem" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>
                    </div>
                    <Button variant="outline" size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Outro Documento
                    </Button>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                <AccordionTrigger>6. Configurações do Sistema</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="space-y-2">
                        <Label>Tipo de empresa</Label>
                        <RadioGroup defaultValue="ambas" className="flex items-center gap-6 pt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="exportadora" id="r1" />
                                <Label htmlFor="r1">Exportadora</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="importadora" id="r2" />
                                <Label htmlFor="r2">Importadora</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ambas" id="r3" />
                                <Label htmlFor="r3">Ambas</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="permissoes">Permissões de usuários internos</Label>
                        <Input id="permissoes" placeholder="Vincular usuários a esta empresa (ex: admin, operador)" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="observacoes">Observações internas</Label>
                        <Textarea id="observacoes" placeholder="Anotações importantes para a equipe..." />
                    </div>
                </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setActiveTab('listagem')}>Cancelar</Button>
                <Button type="submit">Salvar Cadastro</Button>
            </div>
            </form>
        </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
