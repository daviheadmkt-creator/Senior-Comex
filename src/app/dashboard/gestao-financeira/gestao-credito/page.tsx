
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { MoreHorizontal, PlusCircle, FileText, Edit, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Recebido':
        case 'Aprovada':
        case 'Liquidada':
            return 'bg-green-100 text-green-800';
        case 'Pendente':
        case 'Em análise':
        case 'Apresentada':
            return 'bg-yellow-100 text-yellow-800';
        case 'Vencido':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}


export default function GestaoCreditoPage() {
  return (
     <Tabs defaultValue="adiantamentos">
        <CardHeader>
            <CardTitle>Gestão de Crédito e Garantias</CardTitle>
            <CardDescription>
            Gerencie adiantamentos, cartas de crédito e cobranças documentárias.
            </CardDescription>
            <TabsList className="grid w-full grid-cols-3 mt-2">
                <TabsTrigger value="adiantamentos">Adiantamentos Recebidos</TabsTrigger>
                <TabsTrigger value="cartas-credito">Cartas de Crédito (L/C)</TabsTrigger>
                <TabsTrigger value="cobrancas">Cobranças Documentárias</TabsTrigger>
            </TabsList>
        </CardHeader>
      
      <TabsContent value="adiantamentos">
        <Card>
            <CardHeader>
                 <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl">Controle de Adiantamentos</CardTitle>
                        <CardDescription>
                        Acompanhe os pagamentos antecipados recebidos dos clientes.
                        </CardDescription>
                    </div>
                    <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Registrar Adiantamento
                    </Button>
                </div>
            </CardHeader>
             <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                    <Input placeholder="Buscar por cliente ou fatura..." className="md:col-span-2" />
                    <Select>
                        <SelectTrigger>
                        <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recebido">Recebido</SelectItem>
                            <SelectItem value="pendente">Pendente de Aplicação</SelectItem>
                            <SelectItem value="aplicado">Aplicado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="border rounded-md">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Fatura Proforma Ref.</TableHead>
                        <TableHead>Valor Recebido</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[5%]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Importadora Exemplo LLC</TableCell>
                            <TableCell>PI-2024-001</TableCell>
                            <TableCell>USD 10.900,00</TableCell>
                            <TableCell>10/07/2024</TableCell>
                            <TableCell>
                                <Badge className={getStatusClass('Recebido')}>Recebido</Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ver Detalhes</DropdownMenuItem>
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

      <TabsContent value="cartas-credito">
         <Card>
            <CardHeader>
                 <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl">Controle de Cartas de Crédito (L/C)</CardTitle>
                        <CardDescription>
                        Gerencie as garantias de pagamento recebidas via L/C.
                        </CardDescription>
                    </div>
                    <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova L/C
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid md:grid-cols-3 gap-4">
                    <Input placeholder="Buscar por cliente ou nº da L/C..." className="md:col-span-2" />
                    <Select>
                        <SelectTrigger>
                        <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="analise">Em análise</SelectItem>
                            <SelectItem value="aprovada">Aprovada</SelectItem>
                            <SelectItem value="liquidada">Liquidada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="border rounded-md">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Nº L/C</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Banco Emissor</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[5%]"></TableHead>
                        </TableRow>
                    </TableHeader>
                     <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">LC12345US</TableCell>
                            <TableCell>Global Trade Corp</TableCell>
                            <TableCell>Citibank N.A.</TableCell>
                            <TableCell>USD 50.000,00</TableCell>
                            <TableCell>30/09/2024</TableCell>
                            <TableCell>
                                <Badge className={getStatusClass('Aprovada')}>Aprovada</Badge>
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
                                        <DropdownMenuItem><Trash2 className="mr-2 h-4 w-4 text-destructive" /> Cancelar</DropdownMenuItem>
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

      <TabsContent value="cobrancas">
         <Card>
            <CardHeader>
                 <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-xl">Controle de Cobranças Documentárias</CardTitle>
                        <CardDescription>
                        Acompanhe o status das cobranças enviadas aos bancos.
                        </CardDescription>
                    </div>
                    <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Cobrança
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                    <Input placeholder="Buscar por cliente ou nº da cobrança..." className="md:col-span-2" />
                    <Select>
                        <SelectTrigger>
                        <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="apresentada">Apresentada</SelectItem>
                            <SelectItem value="aceita">Aceita</SelectItem>
                            <SelectItem value="liquidada">Liquidada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="border rounded-md">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Nº Cobrança</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Banco Apresentante</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[5%]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         <TableRow>
                            <TableCell className="font-medium">CAD-BR-001</TableCell>
                            <TableCell>Comercial Andina S.A.</TableCell>
                            <TableCell>Banco Itaú</TableCell>
                            <TableCell>USD 12.300,00</TableCell>
                            <TableCell>01/08/2024</TableCell>
                            <TableCell>
                                <Badge className={getStatusClass('Apresentada')}>Apresentada</Badge>
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
                                        <DropdownMenuItem><Trash2 className="mr-2 h-4 w-4 text-destructive" /> Cancelar</DropdownMenuItem>
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
    </Tabs>
  );
}
