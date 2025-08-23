
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
import { PlusCircle, MoreHorizontal, FileDown, Trash2, Edit, Copy, Search, Paperclip } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Ativo':
            return 'bg-green-100 text-green-800';
        case 'Em elaboração':
            return 'bg-yellow-100 text-yellow-800';
        case 'Encerrado':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function RegimesAduaneirosPage() {
    const [activeTab, setActiveTab] = useState("listagem");

    return (
        <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="listagem">Listagem</TabsTrigger>
                        <TabsTrigger value="cadastro">Novo Regime</TabsTrigger>
                    </TabsList>
                    <Button onClick={() => setActiveTab("cadastro")}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Regime Aduaneiro
                    </Button>
                </div>
                <TabsContent value="listagem">
                    <Card>
                    <CardHeader>
                        <div>
                            <CardTitle>Controle de Regimes Aduaneiros Especiais</CardTitle>
                            <CardDescription>
                            Gerencie seus processos de Drawback, Exportação Temporária, etc.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-4 gap-4">
                            <Input placeholder="Buscar por nº do processo ou cliente..." className="md:col-span-2" />
                            <Select>
                                <SelectTrigger>
                                <SelectValue placeholder="Filtrar por tipo de regime" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="drawback">Drawback</SelectItem>
                                    <SelectItem value="exportacao-temporaria">Exportação Temporária</SelectItem>
                                    <SelectItem value="admissao-temporaria">Admissão Temporária</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger>
                                <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="elaboracao">Em elaboração</SelectItem>
                                    <SelectItem value="encerrado">Encerrado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="border rounded-md">
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Nº Processo</TableHead>
                                <TableHead>Tipo de Regime</TableHead>
                                <TableHead>Cliente/Empresa</TableHead>
                                <TableHead>Data de Validade</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[5%]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">AC-2023-12345</TableCell>
                                    <TableCell>Drawback Suspensão</TableCell>
                                    <TableCell>Importadora Exemplo LLC</TableCell>
                                    <TableCell>31/12/2024</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusClass('Ativo')}>Ativo</Badge>
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
                                                <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Exportar Relatório</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Encerrar Processo</DropdownMenuItem>
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
                            <CardTitle>Cadastro de Regime Aduaneiro Especial</CardTitle>
                            <CardDescription>
                            Preencha os campos para iniciar um novo processo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-8">
                            <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']}>

                                <AccordionItem value="item-1">
                                    <AccordionTrigger>1. Dados Gerais do Processo</AccordionTrigger>
                                    <AccordionContent className="space-y-4 p-1">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Tipo de Regime Aduaneiro</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="drawback-suspensao">Drawback - Suspensão</SelectItem>
                                                        <SelectItem value="drawback-isencao">Drawback - Isenção</SelectItem>
                                                        <SelectItem value="exportacao-temporaria">Exportação Temporária</SelectItem>
                                                        <SelectItem value="admissao-temporaria">Admissão Temporária</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="processo-numero">Número do Processo / Ato Concessório</Label>
                                                <Input id="processo-numero" placeholder="Número do documento" />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="data-inicio">Data de Início</Label>
                                                <Input id="data-inicio" type="date" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="data-validade">Data de Validade</Label>
                                                <Input id="data-validade" type="date" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="empresa-vinculada">Empresa / Cliente Vinculado</Label>
                                            <Select>
                                                <SelectTrigger id="empresa-vinculada">
                                                    <SelectValue placeholder="Selecione a empresa" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="empresa1">Senior Assessoria</SelectItem>
                                                    <SelectItem value="cliente1">Importadora Exemplo LLC</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="descricao-operacao">Descrição da Operação</Label>
                                            <Textarea id="descricao-operacao" placeholder="Descreva o objetivo e os detalhes da operação sob este regime." />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>2. Produtos e Mercadorias</AccordionTrigger>
                                    <AccordionContent className="space-y-4 p-1">
                                        <div className="border rounded-md">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[40%]">Produto</TableHead>
                                                        <TableHead>NCM</TableHead>
                                                        <TableHead>Quantidade</TableHead>
                                                        <TableHead>Valor (USD)</TableHead>
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
                                                                    <SelectItem value="produto1">Insumo A</SelectItem>
                                                                    <SelectItem value="produto2">Componente B</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell>3926.90.90</TableCell>
                                                        <TableCell><Input type="number" placeholder="1000" className="w-24"/></TableCell>
                                                        <TableCell><Input type="number" placeholder="5000.00" className="w-28"/></TableCell>
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
                                            Adicionar Produto
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3">
                                    <AccordionTrigger>3. Documentação e Status</AccordionTrigger>
                                    <AccordionContent className="space-y-4 p-1">
                                        <div className="space-y-2">
                                            <Label htmlFor="anexos">Anexar Documentos</Label>
                                            <div className="flex gap-2 items-center">
                                                <Input id="anexos" type="file" multiple className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Anexe o Ato Concessório, laudos, e outros documentos pertinentes.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Status do Processo</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="elaboracao">Em elaboração</SelectItem>
                                                    <SelectItem value="ativo">Ativo</SelectItem>
                                                    <SelectItem value="encerrado">Encerrado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="observacoes-regime">Observações Internas</Label>
                                            <Textarea id="observacoes-regime" placeholder="Anotações importantes para a equipe sobre este processo." />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" type="button" onClick={() => setActiveTab("listagem")}>Cancelar</Button>
                                <Button type="submit">Salvar Processo</Button>
                            </div>
                            </form>
                        </CardContent>
                        </Card>
                </TabsContent>
            </Tabs>
        </div>
  );
}
