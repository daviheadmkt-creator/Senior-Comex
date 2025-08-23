
'use client';

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
import { MoreHorizontal, DollarSign, FileText, Search } from 'lucide-react';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Paga':
            return 'bg-green-100 text-green-800';
        case 'A Pagar':
            return 'bg-yellow-100 text-yellow-800';
        case 'Vencida':
            return 'bg-red-100 text-red-800';
        default:
            return '';
    }
}


export default function ContasAPagarPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Controle de Contas a Pagar</CardTitle>
                <CardDescription>
                Acompanhe o status de todas as suas faturas de fornecedores e parceiros.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-4 gap-4">
            <Input placeholder="Buscar por fornecedor ou fatura..." className="md:col-span-2" />
            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pagar">A Pagar</SelectItem>
                    <SelectItem value="paga">Paga</SelectItem>
                    <SelectItem value="vencida">Vencida</SelectItem>
                </SelectContent>
            </Select>
            <Input type="date" placeholder="Filtrar por data de vencimento" />
        </div>
         <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Fornecedor/Parceiro</TableHead>
                <TableHead>Fatura Ref.</TableHead>
                <TableHead>Data de Emissão</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[5%]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">Transportadora Rápida Ltda</TableCell>
                    <TableCell>FAT-TR-00123</TableCell>
                    <TableCell>10/07/2024</TableCell>
                    <TableCell>10/08/2024</TableCell>
                    <TableCell>R$ 3.500,00</TableCell>
                    <TableCell>
                        <Badge className={getStatusClass('A Pagar')}>A Pagar</Badge>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><DollarSign className="mr-2 h-4 w-4" /> Registrar Pagamento</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ver Fatura</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">Despachante Ágil</TableCell>
                    <TableCell>FAT-DA-456</TableCell>
                    <TableCell>01/07/2024</TableCell>
                    <TableCell>15/07/2024</TableCell>
                    <TableCell>R$ 1.800,00</TableCell>
                    <TableCell>
                        <Badge className={getStatusClass('Vencida')}>Vencida</Badge>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><DollarSign className="mr-2 h-4 w-4" /> Registrar Pagamento</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ver Fatura</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">Embalagens Seguras S.A.</TableCell>
                    <TableCell>NFE-9987</TableCell>
                    <TableCell>25/06/2024</TableCell>
                    <TableCell>25/07/2024</TableCell>
                    <TableCell>R$ 5.200,00</TableCell>
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
                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ver Fatura</DropdownMenuItem>
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
