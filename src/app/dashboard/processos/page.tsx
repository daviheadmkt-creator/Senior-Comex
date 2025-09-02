
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
import { PlusCircle, Search, Pencil, Trash2 } from 'lucide-react';
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
import { useEffect, useState } from 'react';

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Iniciado / Aguardando Booking':
            return 'secondary';
        case 'Em andamento':
            return 'default';
        case 'Atrasado':
            return 'destructive';
        case 'Concluído':
            return 'outline';
        default:
            return 'secondary';
    }
}

export default function GestaoProcessosPage() {
  const [processos, setProcessos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedProcessos = localStorage.getItem('processos');
    if (storedProcessos) {
      setProcessos(JSON.parse(storedProcessos));
    }
  }, []);

  const handleDelete = (id: number) => {
    const updatedProcessos = processos.filter(p => p.id !== id);
    setProcessos(updatedProcessos);
    localStorage.setItem('processos', JSON.stringify(updatedProcessos));
  };
  
  const filteredProcessos = processos.filter(processo => 
      processo.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.exportadorNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestão de Processos</CardTitle>
            <CardDescription>
              Acompanhe todos os seus processos de exportação em um só lugar.
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
            <Input 
                placeholder="Buscar por Referência (PO) ou Cliente..." 
                className="pl-8" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referência (PO)</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProcessos.map((processo) => (
              <TableRow key={processo.id}>
                <TableCell className="font-medium">{processo.po_number}</TableCell>
                <TableCell>{processo.exportadorNome}</TableCell>
                <TableCell>{processo.produtoNome}</TableCell>
                <TableCell>{processo.destino}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(processo.status)}>
                    {processo.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <Link href={`/dashboard/processos/novo?id=${processo.id}&edit=true`} passHref>
                      <Button variant="outline" size="icon" className="text-green-600 hover:text-green-700">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700">
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
                          <AlertDialogAction onClick={() => handleDelete(processo.id)}>Excluir</AlertDialogAction>
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
