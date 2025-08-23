import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { PlusCircle, MoreHorizontal, FileDown, Trash2, Edit, Copy } from 'lucide-react';

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Emitida':
            return 'bg-blue-100 text-blue-800';
        case 'Paga':
            return 'bg-green-100 text-green-800';
        case 'Vencida':
            return 'bg-red-100 text-red-800';
        case 'Cancelada':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function GestaoCommercialInvoicePage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Controle de Commercial Invoices</CardTitle>
                <CardDescription>
                Gerencie e emita suas faturas comerciais de exportação.
                </CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Fatura
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="grid md:grid-cols-4 gap-4">
            <Input placeholder="Buscar por cliente ou nº da fatura..." className="md:col-span-2" />
            <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emitida">Emitida</SelectItem>
                  <SelectItem value="paga">Paga</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
            </Select>
            <Input type="date" placeholder="Filtrar por data de emissão" />
        </div>

        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nº Fatura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data de Emissão</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[5%]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">CI-2024-001</TableCell>
                    <TableCell>Importadora Exemplo LLC</TableCell>
                    <TableCell>15/07/2024</TableCell>
                    <TableCell>15/08/2024</TableCell>
                    <TableCell>$ 21.800,00</TableCell>
                     <TableCell>
                        <Badge className={getStatusClass('Paga')}>Paga</Badge>
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
                                <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicar Fatura</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Cancelar</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">CI-2024-002</TableCell>
                    <TableCell>Global Trade Corp</TableCell>
                    <TableCell>20/07/2024</TableCell>
                    <TableCell>20/08/2024</TableCell>
                    <TableCell>$ 5.400,00</TableCell>
                     <TableCell>
                        <Badge className={getStatusClass('Emitida')}>Emitida</Badge>
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
                                <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicar Fatura</DropdownMenuItem>
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
  );
}
