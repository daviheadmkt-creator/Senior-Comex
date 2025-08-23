
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
import { PlusCircle, MoreHorizontal, FileText, Send, History, Search } from 'lucide-react';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Ativo':
            return 'bg-green-100 text-green-800';
        case 'Pendente':
            return 'bg-yellow-100 text-yellow-800';
        case 'Inativo':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function IntegracaoDespachantesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Integração com Despachantes</CardTitle>
                <CardDescription>
                Gerencie a comunicação e o envio de documentos para seus despachantes.
                </CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Conectar Novo Despachante
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
            <Input placeholder="Buscar por nome do despachante..." className="md:col-span-2" />
            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
            </Select>
        </div>
         <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Despachante</TableHead>
                <TableHead>Contato Principal</TableHead>
                <TableHead>Status da Integração</TableHead>
                <TableHead>Última Sincronização</TableHead>
                <TableHead className="w-[5%]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">Despachante Exemplo S.A.</TableCell>
                    <TableCell>Carlos Silva (carlos@despachante.com)</TableCell>
                    <TableCell>
                        <Badge className={getStatusClass('Ativo')}>Ativo</Badge>
                    </TableCell>
                    <TableCell>15/07/2024 10:30</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ver Detalhes</DropdownMenuItem>
                                <DropdownMenuItem><Send className="mr-2 h-4 w-4" /> Enviar Documentos</DropdownMenuItem>
                                <DropdownMenuItem><History className="mr-2 h-4 w-4" /> Ver Histórico</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">Agile Comex</TableCell>
                    <TableCell>Ana Pereira (ana.p@agile.com)</TableCell>
                    <TableCell>
                        <Badge className={getStatusClass('Pendente')}>Pendente</Badge>
                    </TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ver Detalhes</DropdownMenuItem>
                                <DropdownMenuItem><Send className="mr-2 h-4 w-4" /> Enviar Convite</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">Global Aduaneira</TableCell>
                    <TableCell>Marcos Rocha (marcos@global.com)</TableCell>
                    <TableCell>
                        <Badge className={getStatusClass('Inativo')}>Inativo</Badge>
                    </TableCell>
                    <TableCell>01/06/2024 18:00</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ver Detalhes</DropdownMenuItem>
                                <DropdownMenuItem><Send className="mr-2 h-4 w-4" /> Reativar Conexão</DropdownMenuItem>
                                <DropdownMenuItem><History className="mr-2 h-4 w-4" /> Ver Histórico</DropdownMenuItem>
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
