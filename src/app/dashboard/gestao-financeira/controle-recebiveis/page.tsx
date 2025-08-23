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
import { MoreHorizontal, DollarSign, Send, FileText, Search } from 'lucide-react';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Recebido':
            return 'bg-green-100 text-green-800';
        case 'A Receber':
            return 'bg-yellow-100 text-yellow-800';
        case 'Vencido':
            return 'bg-red-100 text-red-800';
        default:
            return '';
    }
}


export default function ControleRecebiveisPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Controle de Recebíveis Internacionais</CardTitle>
                <CardDescription>
                Acompanhe o status de todos os seus pagamentos a receber.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-4 gap-4">
            <Input placeholder="Buscar por cliente ou fatura..." className="md:col-span-2" />
            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="receber">A Receber</SelectItem>
                    <SelectItem value="recebido">Recebido</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
            </Select>
            <Input type="date" placeholder="Filtrar por data de vencimento" />
        </div>
         <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Fatura Nº</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data de Emissão</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Valor (USD)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[5%]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">CI-2024-001</TableCell>
                    <TableCell>Importadora Exemplo LLC</TableCell>
                    <TableCell>15/07/2024</TableCell>
                    <TableCell>14/08/2024</TableCell>
                    <TableCell>$ 21.800,00</TableCell>
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
                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ver Fatura</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">CI-2024-002</TableCell>
                    <TableCell>Global Trade Corp</TableCell>
                    <TableCell>01/07/2024</TableCell>
                    <TableCell>01/08/2024</TableCell>
                    <TableCell>$ 5.400,00</TableCell>
                    <TableCell>
                        <Badge className={getStatusClass('A Receber')}>A Receber</Badge>
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
                                <DropdownMenuItem><Send className="mr-2 h-4 w-4" /> Enviar Lembrete</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ver Fatura</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">CI-2024-003</TableCell>
                    <TableCell>Comercial Andina S.A.</TableCell>
                    <TableCell>01/06/2024</TableCell>
                    <TableCell>01/07/2024</TableCell>
                    <TableCell>$ 12.300,00</TableCell>
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
                                <DropdownMenuItem><DollarSign className="mr-2 h-4 w-4" /> Registrar Pagamento</DropdownMenuItem>
                                <DropdownMenuItem><Send className="mr-2 h-4 w-4" /> Enviar Cobrança</DropdownMenuItem>
                                <DropdownMenuSeparator />
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
