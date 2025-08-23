
"use client";

import { useState } from 'react';
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
import { PlusCircle, MoreHorizontal, FileDown, Trash2, Edit, Copy, Search, AlertTriangle, Bell, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Em dia':
            return 'bg-green-100 text-green-800';
        case 'Atenção':
            return 'bg-yellow-100 text-yellow-800';
        case 'Vencido':
            return 'bg-red-100 text-red-800';
        case 'Concluído':
             return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}

const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Vencido';
    return `${diffDays} dias`;
}


export default function ControlePrazosPage() {
    const [activeTab, setActiveTab] = useState("listagem");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
                <TabsList>
                    <TabsTrigger value="listagem">Listagem de Prazos</TabsTrigger>
                    <TabsTrigger value="cadastro">Novo Prazo</TabsTrigger>
                </TabsList>
                 <Button onClick={() => setActiveTab("cadastro")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Prazo
                </Button>
            </div>
            <TabsContent value="listagem">
                <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Controle de Prazos Legais e Operacionais</CardTitle>
                        <CardDescription>
                         Gerencie e acompanhe os vencimentos importantes para seus processos.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4">
                        <Input placeholder="Buscar por processo ou referência..." className="md:col-span-2" />
                        <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Filtrar por tipo de prazo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="documental">Documental</SelectItem>
                                <SelectItem value="operacional">Operacional</SelectItem>
                                <SelectItem value="financeiro">Financeiro</SelectItem>
                                <SelectItem value="legal">Legal</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger>
                            <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="em-dia">Em dia</SelectItem>
                                <SelectItem value="atencao">Atenção</SelectItem>
                                <SelectItem value="vencido">Vencido</SelectItem>
                                <SelectItem value="concluido">Concluído</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border rounded-md">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Processo / Referência</TableHead>
                            <TableHead>Tipo de Prazo</TableHead>
                            <TableHead>Data de Vencimento</TableHead>
                            <TableHead>Dias Restantes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[5%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">AC-2023-12345 (Drawback)</TableCell>
                                <TableCell>Legal</TableCell>
                                <TableCell>31/12/2024</TableCell>
                                <TableCell>169 dias</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('Em dia')}>Em dia</Badge>
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
                                            <DropdownMenuItem><CheckCircle className="mr-2 h-4 w-4" /> Marcar como Concluído</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">CI-2024-003</TableCell>
                                <TableCell>Financeiro</TableCell>
                                <TableCell>01/07/2024</TableCell>
                                <TableCell className="text-red-600 font-semibold">{getDaysRemaining('2024-07-01')}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('Vencido')}>Vencido</Badge>
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
                                            <DropdownMenuItem><CheckCircle className="mr-2 h-4 w-4" /> Marcar como Concluído</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-medium">PED-001 - Embarque</TableCell>
                                <TableCell>Operacional</TableCell>
                                <TableCell>22/07/2024</TableCell>
                                <TableCell>7 dias</TableCell>
                                <TableCell>
                                    <Badge className={getStatusClass('Atenção')}>Atenção</Badge>
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
                                            <DropdownMenuItem><CheckCircle className="mr-2 h-4 w-4" /> Marcar como Concluído</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
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
                        <CardTitle>Cadastro de Novo Prazo</CardTitle>
                        <CardDescription>
                         Preencha os campos para adicionar um novo prazo ao sistema.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                           <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ref-processo">Referência / Processo</Label>
                                    <Input id="ref-processo" placeholder="Ex: PED-001, CI-2024-002, AC-2023-12345" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tipo de Prazo</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="documental">Documental (Ex: Validade de licença)</SelectItem>
                                            <SelectItem value="operacional">Operacional (Ex: Data de embarque)</SelectItem>
                                            <SelectItem value="financeiro">Financeiro (Ex: Vencimento de fatura)</SelectItem>
                                            <SelectItem value="legal">Legal (Ex: Vencimento de regime aduaneiro)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                           </div>
                           <div className="space-y-2">
                                <Label htmlFor="prazo-desc">Descrição do Prazo</Label>
                                <Input id="prazo-desc" placeholder="Ex: Prazo final para embarque da mercadoria" />
                           </div>
                           <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="data-vencimento">Data de Vencimento</Label>
                                    <Input id="data-vencimento" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status Inicial</Label>
                                    <Select defaultValue="em-dia">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="em-dia">Em dia</SelectItem>
                                            <SelectItem value="atencao">Atenção</SelectItem>
                                            <SelectItem value="concluido">Concluído</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                           </div>
                            <div className="grid md:grid-cols-2 gap-4">
                               <div className="space-y-2">
                                    <Label htmlFor="responsavel">Responsável Interno</Label>
                                    <Input id="responsavel" placeholder="Nome do usuário responsável" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="alerta">Notificar com Antecedência (dias)</Label>
                                    <Input id="alerta" type="number" placeholder="Ex: 7" />
                                </div>
                           </div>
                           <div className="space-y-2">
                                <Label htmlFor="obs-prazo">Observações</Label>
                                <Textarea id="obs-prazo" placeholder="Detalhes adicionais, contatos, etc." />
                           </div>
                           
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" type="button" onClick={() => setActiveTab("listagem")}>Cancelar</Button>
                                <Button type="submit">Salvar Prazo</Button>
                            </div>
                        </form>
                    </CardContent>
                    </Card>
            </TabsContent>
        </Tabs>
  );
}

    