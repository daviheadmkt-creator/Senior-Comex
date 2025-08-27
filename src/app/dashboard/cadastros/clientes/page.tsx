
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const clients = [
  {
    nomeEmpresa: 'Importadora Exemplo LLC',
    pais: 'Estados Unidos',
    contatoPrincipal: 'John Doe',
    status: 'Ativo',
  },
  {
    nomeEmpresa: 'Global Trade Corp',
    pais: 'Argentina',
    contatoPrincipal: 'Maria Garcia',
    status: 'Ativo',
  },
  {
    nomeEmpresa: 'Euro Importers',
    pais: 'Alemanha',
    contatoPrincipal: 'Hans Müller',
    status: 'Inativo',
  },
  {
    nomeEmpresa: 'Asian Buyers Co.',
    pais: 'Japão',
    contatoPrincipal: 'Yuki Tanaka',
    status: 'Em prospecção',
  },
];

const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'ativo':
            return 'default';
        case 'inativo':
            return 'secondary';
        case 'em prospecção':
            return 'outline';
        default:
            return 'secondary';
    }
}


export default function ListaClientesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Clientes Internacionais</CardTitle>
            <CardDescription>
              Gerencie os clientes e importadores da sua empresa.
            </CardDescription>
          </div>
          <Link href="/dashboard/cadastros/clientes/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome da empresa..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Empresa</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Contato Principal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.nomeEmpresa}>
                <TableCell className="font-medium">{client.nomeEmpresa}</TableCell>
                <TableCell>{client.pais}</TableCell>
                <TableCell>{client.contatoPrincipal}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(client.status)} className={
                        client.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                        client.status === 'Inativo' ? 'bg-gray-100 text-gray-800' :
                        client.status === 'Em prospecção' ? 'bg-yellow-100 text-yellow-800' : ''
                    }>
                        {client.status}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                        <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-green-600 hover:text-green-700">
                             <Pencil className="h-4 w-4" />
                        </Button>
                         <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700">
                             <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
