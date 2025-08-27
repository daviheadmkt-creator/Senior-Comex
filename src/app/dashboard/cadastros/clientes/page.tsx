
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

const clients = [
  {
    id: 'CLI-001',
    razaoSocial: 'AgroExport Brasil Ltda.',
    cnpj: '12.345.678/0001-99',
    cidade: 'São Paulo',
    estado: 'SP',
    status: 'Ativo',
  },
  {
    id: 'CLI-002',
    razaoSocial: 'Grãos do Sul S.A.',
    cnpj: '98.765.432/0001-11',
    cidade: 'Porto Alegre',
    estado: 'RS',
    status: 'Ativo',
  },
  {
    id: 'CLI-003',
    razaoSocial: 'União Agrícola',
    cnpj: '45.678.912/0001-33',
    cidade: 'Cuiabá',
    estado: 'MT',
    status: 'Inativo',
  },
];

export default function ListaClientesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Gerencie os clientes da sua empresa.
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
                <Input placeholder="Buscar por nome ou CNPJ..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Razão Social</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.id}</TableCell>
                <TableCell>{client.razaoSocial}</TableCell>
                <TableCell>{client.cnpj}</TableCell>
                <TableCell>{client.cidade}</TableCell>
                <TableCell>{client.estado}</TableCell>
                <TableCell>{client.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
