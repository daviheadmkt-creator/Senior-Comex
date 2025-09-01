

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
import { PlusCircle, Search, Pencil, Trash2, Eye, ClipboardCheck } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';


const processos = [
  {
    id: 1,
    referencia: 'SEN2378-25',
    cliente: 'Agrícola Exemplo LTDA',
    po_number: 'PO-12345',
    produto: 'Soja em Grãos',
    navio: 'MSC CARMEN',
    origemDestino: 'Santos / Xangai',
    analista: 'Ana Silva',
    status: 'Em trânsito',
     timeline: [
        {date: '03/07/2024', event: 'Reserva feita no CMA CGM BUZIOS'},
        {date: '27/07/2024', event: 'Processo previsto'},
        {date: '31/07/2024', event: 'Carga embarcada'},
        {date: '08/09/2024', event: 'Previsão de chegada'},
    ]
  },
   {
    id: 2,
    referencia: 'SEN2378-26',
    cliente: 'Comércio de Grãos Brasil S.A.',
    po_number: 'PO-67890',
    produto: 'Milho em Grãos',
    navio: 'MAERSK LINE',
    origemDestino: 'Paranaguá / Roterdã',
    analista: 'Carlos Dias',
    status: 'Aguardando embarque',
    timeline: [
        {date: '10/07/2024', event: 'Reserva feita'},
        {date: '05/08/2024', event: 'Previsão de embarque'},
    ]
  },
  {
    id: 3,
    referencia: 'SEN2378-27',
    cliente: 'Fazenda Sol Nascente',
    po_number: 'PO-13579',
    produto: 'Feijão Carioca Tipo 1',
    navio: 'CMA CGM',
    origemDestino: 'Itajaí / Singapura',
    analista: 'Ana Silva',
    status: 'Concluído',
    timeline: [
        {date: '01/06/2024', event: 'Reserva feita'},
        {date: '20/06/2024', event: 'Carga embarcada'},
        {date: '25/07/2024', event: 'Carga entregue no destino'},
    ]
  },
    {
    id: 4,
    referencia: 'SEN2378-28',
    cliente: 'Produtores Associados',
    po_number: 'PO-24680',
    produto: 'Gergelim Branco',
    navio: 'HAPAG-LLOYD',
    origemDestino: 'Santos / Dubai',
    analista: 'Daniela Lima',
    status: 'Atrasado',
    timeline: [
        {date: '15/07/2024', event: 'Reserva feita'},
        {date: '25/07/2024', event: 'Atraso na liberação da carga'},
    ]
  },
];

const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'em trânsito':
            return 'default';
        case 'concluído':
            return 'default';
        case 'aguardando embarque':
            return 'secondary';
        case 'atrasado':
            return 'destructive';
        default:
            return 'outline';
    }
}

const Timeline = ({ events }: { events: { date: string; event: string }[] }) => (
  <div className="space-y-8 mt-4">
    <ul className="space-y-6">
      {events.map((item, index) => (
        <li key={index} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ClipboardCheck className="h-4 w-4" />
            </div>
            {index < events.length - 1 && (
              <div className="h-12 w-px bg-border" />
            )}
          </div>
          <div>
            <p className="font-semibold">{item.event}</p>
            <time className="text-sm text-muted-foreground">{item.date}</time>
          </div>
        </li>
      ))}
    </ul>
  </div>
);


export default function GestaoProcessosPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestão de Processos</CardTitle>
            <CardDescription>
              Gerencie todos os seus processos de exportação em um só lugar.
            </CardDescription>
          </div>
           <Link href="/dashboard/processos/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Processo
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por referência ou cliente..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referência</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>PO Number</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Navio</TableHead>
              <TableHead>Analista</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processos.map((processo) => (
              <TableRow key={processo.id}>
                <TableCell className="font-medium">{processo.referencia}</TableCell>
                <TableCell>{processo.cliente}</TableCell>
                <TableCell>{processo.po_number}</TableCell>
                <TableCell>{processo.produto}</TableCell>
                <TableCell>{processo.navio}</TableCell>
                <TableCell>{processo.analista}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(processo.status)} className={
                        processo.status === 'Em trânsito' ? 'bg-blue-100 text-blue-800' :
                        processo.status === 'Concluído' ? 'bg-green-100 text-green-800' :
                        processo.status === 'Aguardando embarque' ? 'bg-yellow-100 text-yellow-800' :
                        processo.status === 'Atrasado' ? 'bg-red-100 text-red-800' : ''
                    }>
                        {processo.status}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                        <Dialog>
                            <DialogTrigger asChild>
                                 <Button variant="outline" size="icon" title="Visualizar Timeline">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Timeline do Processo - {processo.referencia}</DialogTitle>
                                    <DialogDescription>
                                        Acompanhe os eventos do processo em ordem cronológica.
                                    </DialogDescription>
                                </DialogHeader>
                                <Timeline events={processo.timeline} />
                            </DialogContent>
                        </Dialog>
                        <Link href={`/dashboard/processos/novo?id=${processo.id}&edit=true`} passHref>
                            <Button variant="outline" size="icon" className="text-green-600 hover:text-green-700" title="Editar">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700" title="Excluir">
                                 <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o processo
                                e removerá seus dados de nossos servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
