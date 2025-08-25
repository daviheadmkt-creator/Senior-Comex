
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
import { PlusCircle, Edit, Eye, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const products = [
    {
        sku: 'SKU-12345',
        name: 'Café Especial Torrado',
        ncm: '0901.21.00',
        status: 'Ativo'
    },
    {
        sku: 'SKU-67890',
        name: 'Soja em Grãos',
        ncm: '1201.90.00',
        status: 'Ativo'
    },
    {
        sku: 'SKU-54321',
        name: 'Açúcar Refinado',
        ncm: '1701.99.00',
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


export default function ProdutosPage() {
  const [activeTab, setActiveTab] = useState("listagem");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="listagem">Produtos Cadastrados</TabsTrigger>
          <TabsTrigger value="cadastro">Cadastrar Produto</TabsTrigger>
        </TabsList>
        <Button onClick={() => setActiveTab('cadastro')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar Produto
        </Button>
      </div>

      <TabsContent value="listagem">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
            <CardDescription>
              Visualize e gerencie os produtos cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Nome do Produto</TableHead>
                    <TableHead>NCM</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[10%] text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.sku}>
                      <TableCell className="font-mono">{product.sku}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.ncm}</TableCell>
                      <TableCell>
                          <Badge className={getStatusClass(product.status)}>{product.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8 bg-blue-100/60 text-blue-600 border-blue-200/70 hover:bg-blue-100 hover:text-blue-700">
                                <Eye className="h-4 w-4" />
                            </Button>
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
            <CardTitle>Cadastro de Produtos</CardTitle>
            <CardDescription>
              Gerencie seus produtos e suas classificações fiscais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-8">
              <Accordion type="multiple" defaultValue={['item-1']}>
                <AccordionItem value="item-1">
                  <AccordionTrigger>1. Identificação do Produto</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="codigo-interno">Código interno do produto</Label>
                        <Input id="codigo-interno" placeholder="SKU-12345" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nome-comercial">Nome comercial</Label>
                        <Input id="nome-comercial" placeholder="Café Especial Torrado" />
                      </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="descricao">Descrição detalhada</Label>
                        <Textarea id="descricao" placeholder="Descrição em português e no idioma do cliente..." />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="categoria">Categoria / família do produto</Label>
                        <Input id="categoria" placeholder="Alimentos" />
                      </div>
                      <div className="space-y-2">
                        <Label>Unidade de medida</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kg</SelectItem>
                            <SelectItem value="m3">m³</SelectItem>
                            <SelectItem value="un">Unidade</SelectItem>
                            <SelectItem value="cx">Caixa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marca-modelo">Marca / modelo</Label>
                      <Input id="marca-modelo" placeholder="Marca Exemplo" />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>2. Classificação Fiscal</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ncm">NCM</Label>
                        <Input id="ncm" placeholder="0901.21.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hs-code">HS Code</Label>
                        <Input id="hs-code" placeholder="0901.21" />
                      </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aliquota">Alíquota de impostos (quando aplicável)</Label>
                        <Input id="aliquota" placeholder="Ex: II, IPI, PIS, COFINS" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="regras-exportacao">Regras de exportação específicas</Label>
                        <Textarea id="regras-exportacao" placeholder="Ex: ANVISA, MAPA, Inmetro..." />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>3. Dados Comerciais</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preco-brl">Preço de venda (BRL)</Label>
                        <Input id="preco-brl" type="number" placeholder="100.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preco-usd">Preço de venda (Moeda Estrangeira)</Label>
                        <Input id="preco-usd" type="number" placeholder="20.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="moeda">Moeda padrão</Label>
                        <Input id="moeda" placeholder="USD" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="peso-liquido">Peso líquido por unidade (kg)</Label>
                        <Input id="peso-liquido" type="number" placeholder="1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="peso-bruto">Peso bruto por unidade (kg)</Label>
                        <Input id="peso-bruto" type="number" placeholder="1.1" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="comprimento">Comprimento (cm)</Label>
                        <Input id="comprimento" type="number" placeholder="30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="largura">Largura (cm)</Label>
                        <Input id="largura" type="number" placeholder="20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="altura">Altura (cm)</Label>
                        <Input id="altura" type="number" placeholder="10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="volume">Volume (m³)</Label>
                        <Input id="volume" type="number" placeholder="0.006" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Embalagem padrão</Label>
                            <Input id="embalagem" placeholder="Caixa, Pallet, Container" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="qtd-embalagem">Quantidade por embalagem / lote</Label>
                            <Input id="qtd-embalagem" type="number" placeholder="50" />
                        </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>4. Documentação</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-1">
                    <div className="space-y-2">
                        <Label htmlFor="certificados">Certificados necessários</Label>
                        <Textarea id="certificados" placeholder="Fitossanitário, de origem, qualidade..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="licencas">Licenças de exportação</Label>
                        <Input id="licencas" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                    <Button variant="outline" size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Outro Documento
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>5. Logística</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-1">
                    <div className="space-y-2">
                        <Label htmlFor="armazenagem">Local de armazenagem</Label>
                        <Input id="armazenagem" placeholder="Estoque / Depósito" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="portos-embarque">Portos de embarque autorizados</Label>
                        <Input id="portos-embarque" placeholder="Porto de Santos, Porto de Paranaguá" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="condicoes-transporte">Condições especiais de transporte</Label>
                        <Input id="condicoes-transporte" placeholder="Refrigerado, Perigoso, Frágil" />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>6. Configurações do Sistema</AccordionTrigger>
                  <AccordionContent className="space-y-4 p-1">
                    <div className="grid md:grid-cols-2 gap-4">
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
                            </RadioGroup>
                        </div>
                         <div className="space-y-2">
                            <Label>Empresa Nacional Vinculada</Label>
                             <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a empresa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="senior">Senior Assessoria em Comércio Exterior Ltda</SelectItem>
                                    <SelectItem value="fornecedor">Fornecedor Nacional Exemplo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="usuario-responsavel">Usuário responsável pelo cadastro</Label>
                        <Input id="usuario-responsavel" placeholder="Vincular usuário" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="observacoes-internas">Observações internas</Label>
                        <Textarea id="observacoes-internas" placeholder="Informações úteis à equipe..." />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setActiveTab('listagem')}>Cancelar</Button>
                <Button type="submit">Salvar Produto</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
