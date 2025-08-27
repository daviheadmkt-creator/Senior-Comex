
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, FileCheck2, FileX2, FileQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const embarques = [
  {
    id: 1,
    referencia: 'SEN2378-25',
    cliente: 'Agrícola Exemplo LTDA',
    statusDUE: 'Averbada',
    statusLPCO: 'Liberado',
    docs: { bl: true, invoice: true, packing: true },
  },
  {
    id: 2,
    referencia: 'SEN2378-26',
    cliente: 'Comércio de Grãos Brasil S.A.',
    statusDUE: 'Em Análise',
    statusLPCO: 'Pendente',
    docs: { bl: true, invoice: false, packing: false },
  },
  {
    id: 3,
    referencia: 'SEN2378-27',
    cliente: 'Fazenda Sol Nascente',
    statusDUE: 'Averbada',
    statusLPCO: 'Liberado',
    docs: { bl: true, invoice: true, packing: true },
  },
  {
    id: 4,
    referencia: 'SEN2378-28',
    cliente: 'Produtores Associados',
    statusDUE: 'Não Iniciada',
    statusLPCO: 'Pendente',
    docs: { bl: false, invoice: false, packing: false },
  },
];

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'averbada':
    case 'liberado':
      return 'default'; // Green
    case 'em análise':
    case 'pendente':
      return 'outline'; // Yellow
    case 'não iniciada':
      return 'secondary'; // Gray
    default:
      return 'secondary';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'averbada':
    case 'liberado':
      return 'bg-green-100 text-green-800';
    case 'em análise':
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function GestaoDocumentalListPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestão Documental</CardTitle>
            <CardDescription>
              Acompanhe o status dos documentos de todos os seus embarques.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por referência ou cliente..."
              className="pl-8"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referência</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status DUE</TableHead>
              <TableHead>Status LPCO</TableHead>
              <TableHead>Documentos</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {embarques.map((embarque) => (
              <TableRow key={embarque.id}>
                <TableCell className="font-medium">
                  {embarque.referencia}
                </TableCell>
                <TableCell>{embarque.cliente}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(embarque.statusDUE)} className={getStatusColor(embarque.statusDUE)}>
                    {embarque.statusDUE}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(embarque.statusLPCO)} className={getStatusColor(embarque.statusLPCO)}>
                    {embarque.statusLPCO}
                  </Badge>
                </TableCell>
                 <TableCell>
                    <div className='flex gap-2'>
                        <span title="BL" className={embarque.docs.bl ? 'text-green-600' : 'text-gray-400'}>
                            <FileCheck2 className="h-5 w-5" />
                        </span>
                         <span title="Invoice" className={embarque.docs.invoice ? 'text-green-600' : 'text-gray-400'}>
                            <FileCheck2 className="h-5 w-5" />
                        </span>
                         <span title="Packing List" className={embarque.docs.packing ? 'text-green-600' : 'text-gray-400'}>
                            <FileCheck2 className="h-5 w-5" />
                        </span>
                    </div>
                 </TableCell>
                <TableCell>
                  <Link href={`/dashboard/gestao-documental/${embarque.id}`} passHref>
                    <Button variant="outline" size="sm">
                      Gerenciar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
