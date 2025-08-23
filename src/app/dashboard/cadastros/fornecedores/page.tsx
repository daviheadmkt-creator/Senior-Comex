
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
import { MoreHorizontal, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';


const fornecedores = [
    {
        nome: 'Transportadora Rápida Ltda',
        tipo: 'Transportadora',
        contato: 'Carlos Almeida',
        status: 'Ativo'
    },
    {
        nome: 'Despachante Ágil',
        tipo: 'Despachante',
        contato: 'Mariana Costa',
        status: 'Ativo'
    },
    {
        nome: 'Embalagens Seguras S.A.',
        tipo: 'Fornecedor',
        contato: 'Fábio Lima',
        status: 'Ativo'
    },
     {
        nome: 'Logística Internacional Antiga',
        tipo: 'Transportadora',
        contato: 'Ricardo Neves',
        status: 'Inativo'
    }
];

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Ativo':
            return 'bg-green-100 text-green-800';
        case 'Inativo':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function FornecedoresPage() {
    const [activeTab, setActiveTab] = useState("listagem");

    return (
     <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
            <TabsTrigger value="listagem">Fornecedores Cadastrados</TabsTrigger>
            <TabsTrigger value="cadastro">Adicionar Fornecedor</TabsTrigger>
        </TabsList>
        <Button onClick={() => setActiveTab("cadastro")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Fornecedor
        </Button>
      </div>

      <TabsContent value="listagem">
         <Card>
            <CardHeader>
                <CardTitle>Fornecedores e Parceiros</CardTitle>
                <CardDescription>
                Visualize e gerencie os fornecedores, transportadoras e despachantes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Contato Principal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[5%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fornecedores.map((fornecedor) => (
                                <TableRow key={fornecedor.nome}>
                                    <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                                    <TableCell>{fornecedor.tipo}</TableCell>
                                    <TableCell>{fornecedor.contato}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusClass(fornecedor.status)}>{fornecedor.status}</Badge>
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
            <CardTitle>Cadastro de Fornecedores e Parceiros</CardTitle>
            <CardDescription>
            Preencha os campos para cadastrar fornecedores, transportadoras ou despachantes.
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
                        <Input id="nome-empresa" placeholder="Nome Fantasia do Parceiro" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="razao-social">Razão social</Label>
                        <Input id="razao-social" placeholder="Razão Social Completa" />
                    </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                        <Label>Tipo de parceiro</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fornecedor">Fornecedor</SelectItem>
                                <SelectItem value="transportadora">Transportadora</SelectItem>
                                <SelectItem value="despachante">Despachante</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cnpj">CNPJ / Identificação fiscal</Label>
                            <Input id="cnpj" placeholder="00.000.000/0001-00" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ie">Inscrição estadual / municipal</Label>
                            <Input id="ie" placeholder="Número da inscrição" />
                        </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="logradouro">Endereço</Label>
                    <Input id="logradouro" placeholder="Avenida Principal" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input id="numero" placeholder="100" />
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
                        <Input id="pais" placeholder="Brasil" />
                    </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="site">Site institucional</Label>
                        <Input id="site" type="url" placeholder="https://parceiro.com" />
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                <AccordionTrigger>2. Dados de Contato</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="responsavel">Nome do responsável principal</Label>
                        <Input id="responsavel" placeholder="Nome Completo do Contato" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo / função</Label>
                        <Input id="cargo" placeholder="Gerente Comercial" />
                    </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email-contato">E-mail principal</Label>
                        <Input
                        id="email-contato"
                        type="email"
                        placeholder="contato@parceiro.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telefone-fixo">Telefone fixo</Label>
                        <Input id="telefone-fixo" placeholder="(11) 5555-4444" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp">Celular / WhatsApp</Label>
                        <Input id="whatsapp" placeholder="(11) 99999-8888" />
                    </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Outros contatos</Label>
                        <Textarea placeholder="Comercial: comercial@parceiro.com, Operacional: op@parceiro.com..." />
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                <AccordionTrigger>3. Informações Específicas</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <Tabs defaultValue="fornecedor" className="w-full">
                    <TabsList>
                        <TabsTrigger value="fornecedor">Fornecedor</TabsTrigger>
                        <TabsTrigger value="transportadora">Transportadora</TabsTrigger>
                        <TabsTrigger value="despachante">Despachante</TabsTrigger>
                    </TabsList>
                    <TabsContent value="fornecedor" className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="produtos-servicos">Produtos/serviços fornecidos</Label>
                            <Textarea id="produtos-servicos" placeholder="Matéria-prima, embalagens, consultoria..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="condicoes-fornecedor">Condições de pagamento e prazos</Label>
                            <Input id="condicoes-fornecedor" placeholder="Ex: 30/60 dias, à vista..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hist-compras">Histórico de compras</Label>
                            <Textarea id="hist-compras" placeholder="Volume, frequência, principais itens..." />
                        </div>
                    </TabsContent>
                    <TabsContent value="transportadora" className="space-y-4 pt-2">
                        <div className="space-y-2">
                        <Label>Tipo de transporte</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o modal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="maritimo">Marítimo</SelectItem>
                                <SelectItem value="aereo">Aéreo</SelectItem>
                                <SelectItem value="rodoviario">Rodoviário</SelectItem>
                                <SelectItem value="multimodal">Multimodal</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="frota-capacidade">Frota e capacidade disponível</Label>
                            <Textarea id="frota-capacidade" placeholder="Ex: 10 caminhões truck, porta-container..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portos-operacao">Portos / aeroportos de operação</Label>
                            <Input id="portos-operacao" placeholder="Porto de Santos, Aeroporto de Guarulhos..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="parcerias-internacionais">Parcerias internacionais (agentes no exterior)</Label>
                            <Input id="parcerias-internacionais" placeholder="Nome dos agentes e países" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="licencas-transporte">Licenças de transporte</Label>
                            <Textarea id="licencas-transporte" placeholder="ANTT, etc." />
                        </div>
                    </TabsContent>
                    <TabsContent value="despachante" className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="registro-rfb">Registro junto à Receita Federal / Siscomex</Label>
                            <Input id="registro-rfb" placeholder="Número do registro" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="especialidades">Especialidades</Label>
                            <Textarea id="especialidades" placeholder="Exportação temporária, drawback, importação, regimes especiais..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portos-atuacao-desp">Portos / aeroportos de atuação</Label>
                            <Input id="portos-atuacao-desp" placeholder="Principais pontos de atuação" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hist-operacoes">Histórico de operações</Label>
                            <Textarea id="hist-operacoes" placeholder="Tipos de mercadoria, volumes, complexidade..." />
                        </div>
                    </TabsContent>
                    </Tabs>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                <AccordionTrigger>4. Financeiro</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="banco-parceiro">Banco</Label>
                            <Input id="banco-parceiro" placeholder="Nome do Banco" />
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
                        <Label htmlFor="condicoes-pagamento">Condições de pagamento acordadas</Label>
                        <Input id="condicoes-pagamento" placeholder="Ex: Pagamento contra apresentação de documentos..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hist-pagamentos">Histórico de pagamentos</Label>
                        <Textarea id="hist-pagamentos" placeholder="Anotações sobre pontualidade, problemas, etc." />
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                <AccordionTrigger>5. Documentação</AccordionTrigger>
                <AccordionContent className="space-y-4 p-1">
                    <div className="space-y-2">
                        <Label htmlFor="contratos">Contratos firmados</Label>
                        <Input id="contratos" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="licencas-op">Licenças de operação</Label>
                        <Input id="licencas-op" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cert-regularidade">Certificados de regularidade</Label>
                        <Input id="cert-regularidade" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
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
                                <RadioGroupItem value="em-analise" id="r3" />
                                <Label htmlFor="r3">Em análise</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="usuario-responsavel">Usuário responsável pelo relacionamento</Label>
                        <Input id="usuario-responsavel" placeholder="Vincular usuário (ex: admin, logistica)" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="observacoes-internas">Observações internas</Label>
                        <Textarea id="observacoes-internas" placeholder="Ex: transportadora confiável para cargas refrigeradas..." />
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
