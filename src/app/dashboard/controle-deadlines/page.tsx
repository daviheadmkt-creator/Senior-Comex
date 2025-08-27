
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
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const deadlines = [
  {
    id: 1,
    referencia: 'SEN2378-25',
    deadlineDraft: '25/07/2024',
    deadlineVGM: '26/07/2024',
    deadlineCarga: '27/07/2024',
    status: 'Próximo',
  },
  {
    id: 2,
    referencia: 'SEN2378-26',
    deadlineDraft: '20/07/2024',
    deadlineVGM: '21/07/2024',
    deadlineCarga: '22/07/2024',
    status: 'Expirado',
  },
  {
    id: 3,
    referencia: 'SEN2378-27',
    deadlineDraft: '10/08/2024',
    deadlineVGM: '11/08/2024',
    deadlineCarga: '12/08/2024',
    status: 'OK',
  },
  {
    id: 4,
    referencia: 'SEN2378-28',
    deadlineDraft: '28/07/2024',
    deadlineVGM: '29/07/2024',
    deadlineCarga: '30/07/2024',
    status: 'Próximo',
  },
];

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'ok':
      return 'default';
    case 'próximo':
      return 'outline';
    case 'expirado':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default function ControleDeadlinesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Controle de Deadlines</CardTitle>
            <CardDescription>
              Gerencie os prazos e deadlines de seus embarques. O sistema envia alertas automáticos antes da expiração.
            </CardDescription>
          </div>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4 gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por referência do embarque..."
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Todos</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>OK</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Próximo</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Expirado</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referência do Embarque</TableHead>
              <TableHead>Deadline Draft</TableHead>
              <TableHead>Deadline VGM</TableHead>
              <TableHead>Deadline Carga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deadlines.map((deadline) => (
              <TableRow key={deadline.id}>
                <TableCell className="font-medium">
                  {deadline.referencia}
                </TableCell>
                <TableCell>{deadline.deadlineDraft}</TableCell>
                <TableCell>{deadline.deadlineVGM}</TableCell>
                <TableCell>{deadline.deadlineCarga}</TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(deadline.status)}
                    className={
                      deadline.status === 'OK'
                        ? 'bg-green-100 text-green-800'
                        : deadline.status === 'Próximo'
                        ? 'bg-yellow-100 text-yellow-800'
                        : deadline.status === 'Expirado'
                        ? 'bg-red-100 text-red-800'
                        : ''
                    }
                  >
                    {deadline.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
