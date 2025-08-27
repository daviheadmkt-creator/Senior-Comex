
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, ClipboardCheck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const embarques = [
  {
    id: 1,
    referencia: 'SEN2378-25',
    produto: 'Soja em Grãos',
    navio: 'MSC CARMEN',
    origemDestino: 'Santos / Xangai',
    previsaoChegada: '08/09/2024',
    status: 'Em trânsito',
     timeline: [
        {date: '03/07/2024', event: 'Reserva feita no CMA CGM BUZIOS'},
        {date: '27/07/2024', event: 'Embarque previsto'},
        {date: '31/07/2024', event: 'Carga embarcada'},
        {date: '08/09/2024', event: 'Previsão de chegada'},
    ]
  },
   {
    id: 2,
    referencia: 'SEN2378-26',
    produto: 'Milho em Grãos',
    navio: 'MAERSK LINE',
    origemDestino: 'Paranaguá / Roterdã',
    previsaoChegada: '15/08/2024',
    status: 'Aguardando embarque',
    timeline: [
        {date: '10/07/2024', event: 'Reserva feita'},
        {date: '05/08/2024', event: 'Previsão de embarque'},
    ]
  },
  {
    id: 4,
    referencia: 'SEN2378-28',
    produto: 'Gergelim Branco',
    navio: 'HAPAG-LLOYD',
    origemDestino: 'Santos / Dubai',
    previsaoChegada: '10/08/2024',
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


export default function ClientEmbarquesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Embarques Ativos</CardTitle>
        <CardDescription>
          Acompanhe o status e os detalhes dos seus embarques em tempo real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referência</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Navio</TableHead>
              <TableHead>Origem/Destino</TableHead>
               <TableHead>Previsão de Chegada</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timeline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {embarques.map((embarque) => (
              <TableRow key={embarque.id}>
                <TableCell className="font-medium">{embarque.referencia}</TableCell>
                <TableCell>{embarque.produto}</TableCell>
                <TableCell>{embarque.navio}</TableCell>
                <TableCell>{embarque.origemDestino}</TableCell>
                <TableCell>{embarque.previsaoChegada}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(embarque.status)} className={
                        embarque.status === 'Em trânsito' ? 'bg-blue-100 text-blue-800' :
                        embarque.status === 'Aguardando embarque' ? 'bg-yellow-100 text-yellow-800' :
                        embarque.status === 'Atrasado' ? 'bg-red-100 text-red-800' : ''
                    }>
                        {embarque.status}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Dialog>
                        <DialogTrigger asChild>
                             <Button variant="outline" size="icon" title="Visualizar Timeline">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Timeline do Embarque - {embarque.referencia}</DialogTitle>
                                <DialogDescription>
                                    Acompanhe os eventos do embarque em ordem cronológica.
                                </DialogDescription>
                            </DialogHeader>
                            <Timeline events={embarque.timeline} />
                        </DialogContent>
                    </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
