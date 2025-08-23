
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
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, Edit, Trash2, FileText } from 'lucide-react';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Embarcado':
            return 'bg-blue-100 text-blue-800';
        case 'Em Estufagem':
            return 'bg-yellow-100 text-yellow-800';
        case 'Desembarcado':
            return 'bg-green-100 text-green-800';
        case 'Vazio':
             return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}


export default function GestaoContainersPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Gestão de Contêineres e Cargas</CardTitle>
                <CardDescription>
                Acompanhe o status e a localização dos seus contêineres.
                </CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Contêiner
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-4 gap-4">
            <Input placeholder="Buscar por nº do contêiner ou lacre..." className="md:col-span-2" />
            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="20-dc">20' Dry</SelectItem>
                    <SelectItem value="40-dc">40' Dry</SelectItem>
                    <SelectItem value="40-hc">40' High Cube</SelectItem>
                     <SelectItem value="20-rf">20' Reefer</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="estufagem">Em Estufagem</SelectItem>
                    <SelectItem value="embarcado">Embarcado</SelectItem>
                    <SelectItem value="desembarcado">Desembarcado</SelectItem>
                    <SelectItem value="vazio">Vazio</SelectItem>
                </SelectContent>
            </Select>
        </div>
         <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nº Contêiner</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Pedido/Processo</TableHead>
                <TableHead>Localização Atual</TableHead>
                <TableHead>Data Embarque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[5%]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">MSCU1234567</TableCell>
                    <TableCell>40' HC</TableCell>
                    <TableCell>PED-001</TableCell>
                    <TableCell>A caminho de New York</TableCell>
                    <TableCell>25/07/2024</TableCell>
                    <TableCell>
                        <Badge className={getStatusClass('Embarcado')}>Embarcado</Badge>
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
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell className="font-medium">TGHU7654321</TableCell>
                    <TableCell>20' Dry</TableCell>
                    <TableCell>PED-002</TableCell>
                    <TableCell>Pátio do exportador</TableCell>
                    <TableCell> - </TableCell>
                    <TableCell>
                        <Badge className={getStatusClass('Em Estufagem')}>Em Estufagem</Badge>
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
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
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
  );
}
