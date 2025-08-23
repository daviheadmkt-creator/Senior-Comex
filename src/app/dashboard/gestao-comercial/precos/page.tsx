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
import { PlusCircle, MoreHorizontal, FileDown, Trash2, Edit } from 'lucide-react';


export default function PrecosPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Gestão de Preços e Listas</CardTitle>
                <CardDescription>
                Crie e gerencie listas de preços para diferentes moedas e clientes.
                </CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Lista de Preços
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="grid md:grid-cols-4 gap-4">
            <Input placeholder="Buscar por nome da lista ou produto..." className="md:col-span-2" />
            <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="brl">BRL</SelectItem>
                </SelectContent>
            </Select>
             <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativa</SelectItem>
                  <SelectItem value="inativo">Inativa</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nome da Lista</TableHead>
                <TableHead>Moeda</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Data de Validade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[5%]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">Tabela Padrão USD</TableCell>
                    <TableCell>USD</TableCell>
                    <TableCell>35</TableCell>
                    <TableCell>31/12/2024</TableCell>
                    <TableCell>
                        <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                    </TableCell>
                    <TableCell>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Ver / Editar Lista</DropdownMenuItem>
                                <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Exportar CSV/XLS</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir Lista</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">Promoção Europa</TableCell>
                    <TableCell>EUR</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>30/09/2024</TableCell>
                     <TableCell>
                        <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                    </TableCell>
                    <TableCell>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Ver / Editar Lista</DropdownMenuItem>
                                <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Exportar CSV/XLS</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir Lista</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">Tabela Antiga BRL</TableCell>
                    <TableCell>BRL</TableCell>
                    <TableCell>50</TableCell>
                    <TableCell>31/12/2023</TableCell>
                     <TableCell>
                        <Badge variant="secondary">Inativa</Badge>
                    </TableCell>
                    <TableCell>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Ver / Editar Lista</DropdownMenuItem>
                                <DropdownMenuItem><FileDown className="mr-2 h-4 w-4" /> Exportar CSV/XLS</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir Lista</DropdownMenuItem>
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
