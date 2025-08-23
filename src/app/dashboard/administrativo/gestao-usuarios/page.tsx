
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
import { PlusCircle, MoreHorizontal, Edit, Trash2, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const getStatusClass = (status: string) => {
    switch (status) {
        case 'Ativo':
            return 'bg-green-100 text-green-800';
        case 'Inativo':
            return 'bg-gray-100 text-gray-800';
        default:
            return '';
    }
}

const users = [
    {
        name: 'Administrador',
        email: 'admin@senior.com',
        role: 'Administrador',
        status: 'Ativo',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    {
        name: 'Operador',
        email: 'operador@senior.com',
        role: 'Operador',
        status: 'Ativo',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    },
    {
        name: 'Financeiro',
        email: 'financeiro@senior.com',
        role: 'Financeiro',
        status: 'Ativo',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    },
     {
        name: 'Usuário Inativo',
        email: 'inativo@senior.com',
        role: 'Visualização',
        status: 'Inativo',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    },
]


export default function GestaoUsuariosPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Gestão de Usuários</CardTitle>
                <CardDescription>
                Gerencie os usuários e suas permissões no sistema.
                </CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Usuário
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
            <Input placeholder="Buscar por nome ou e-mail..." className="md:col-span-2" />
            <Select>
                <SelectTrigger>
                <SelectValue placeholder="Filtrar por cargo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="operador">Operador</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="visualizacao">Visualização</SelectItem>
                </SelectContent>
            </Select>
        </div>
         <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[35%]">Usuário</TableHead>
                <TableHead className="w-[30%]">E-mail</TableHead>
                <TableHead className="w-[15%]">Cargo</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
                <TableHead className="w-[10%]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.email}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                            <Badge className={getStatusClass(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Editar Usuário</DropdownMenuItem>
                                    <DropdownMenuItem><UserCog className="mr-2 h-4 w-4" /> Gerenciar Permissões</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Desativar Usuário</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
