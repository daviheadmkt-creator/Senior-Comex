import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { PlusCircle, Search, MoreHorizontal, FileText, Trash2, Edit, Paperclip, FileDown } from 'lucide-react';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Novo':
      return 'secondary';
    case 'Em produção':
      return 'default';
    case 'Em transporte':
      return 'outline';
    case 'Concluído':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Novo':
            return 'bg-blue-100 text-blue-800';
        case 'Em produção':
            return 'bg-yellow-100 text-yellow-800';
        case 'Em transporte':
            return 'bg-orange-100 text-orange-800';
        case 'Concluído':
            return 'bg-green-100 text-green-800';
        default:
            return '';
    }
}


export default function PedidosContratosPage() {
  return (
    <Tabs defaultValue="pedidos">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="pedidos">Pedidos Internacionais</TabsTrigger>
          <TabsTrigger value="contratos">Contratos de Venda</TabsTrigger>
        </TabsList>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {/* This button should change based on the active tab */}
          Novo Pedido
        </Button>
      </div>

      <TabsContent value="pedidos">
        <Card>
          <CardHeader>
            <CardTitle>Controle de Pedidos Internacionais</CardTitle>
            <CardDescription>
              Gerencie os pedidos internacionais e seus status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <Input placeholder="Buscar por cliente ou nº do pedido..." className="md:col-span-2" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="producao">Em produção</SelectItem>
                  <SelectItem value="transporte">Em transporte</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" placeholder="Filtrar por data" />
            </div>
            <div className="border rounded-md">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nº Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>Data Entrega</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">PED-001</TableCell>
                        <TableCell>Importadora Exemplo LLC</TableCell>
                        <TableCell>10/07/2024</TableCell>
                        <TableCell>30/08/2024</TableCell>
                        <TableCell>$ 21.800,00</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant('Em produção')} className={getStatusClass('Em produção')}>Em produção</Badge>
                        </TableCell>
                        <TableCell>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Ver / Editar Pedido</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Gerar Commercial Invoice</DropdownMenuItem>
                                    <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Gerar Packing List</DropdownMenuItem>
                                    <DropdownMenuItem><Paperclip className="mr-2 h-4 w-4" /> Anexar Documentos</DropdownMenuItem>
                                     <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir Pedido</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-medium">PED-002</TableCell>
                        <TableCell>Global Trade Corp</TableCell>
                        <TableCell>15/07/2024</TableCell>
                        <TableCell>15/09/2024</TableCell>
                        <TableCell>$ 5.400,00</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant('Novo')} className={getStatusClass('Novo')}>Novo</Badge>
                        </TableCell>
                        <TableCell>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Ver / Editar Pedido</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Gerar Commercial Invoice</DropdownMenuItem>
                                    <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Gerar Packing List</DropdownMenuItem>
                                    <DropdownMenuItem><Paperclip className="mr-2 h-4 w-4" /> Anexar Documentos</DropdownMenuItem>
                                     <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir Pedido</DropdownMenuItem>
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

      <TabsContent value="contratos">
        <Card>
          <CardHeader>
            <CardTitle>Controle de Contratos de Venda</CardTitle>
            <CardDescription>
              Gerencie os contratos vinculados aos pedidos internacionais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid md:grid-cols-3 gap-4">
              <Input placeholder="Buscar por cliente ou nº do contrato..." className="md:col-span-2" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="expirado">Expirado</SelectItem>
                   <SelectItem value="rascunho">Rascunho</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border rounded-md">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nº Contrato</TableHead>
                    <TableHead>Pedido Vinculado</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data de Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">CON-001</TableCell>
                        <TableCell>PED-001</TableCell>
                        <TableCell>Importadora Exemplo LLC</TableCell>
                        <TableCell>30/08/2025</TableCell>
                         <TableCell>
                            <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        </TableCell>
                        <TableCell>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Ver / Editar Contrato</DropdownMenuItem>
                                    <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Exportar PDF</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir Contrato</DropdownMenuItem>
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
