
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

const initialProcessos = [
    {
        id: 1,
        processo_interno: 'SEN-2024-001',
        po_number: '3426B',
        produtoId: '1',
        produtoNome: 'Gergelim',
        quantidade: '270,00000 TON',
        exportadorId: '1',
        exportadorNome: 'AGRICOLA FERRARI',
        terminalEstufagemId: '5',
        portoEmbarqueId: '1',
        portoDescargaId: '2',
        destino: 'Damietta',
        status: 'Booking Confirmado / Aguardando Draft',
        booking_number: 'EBKG12749239',
        armadorId: '3',
        navio: 'MSC EUGENIA',
        viagem: 'NAS21R',
        documentos: [
            { id: 'bl', name: 'Bill of Lading (B/L)', status: 'Aguardando Envio' },
            { id: 'invoice', name: 'Commercial Invoice', status: 'Aguardando Envio' },
            { id: 'packing', name: 'Packing List', status: 'Aguardando Envio' },
            { id: 'co', name: 'Certificado de Origem', status: 'Aguardando Envio' },
        ],
        containers: [
            { id: 1, numero: 'MSCU1234567', lacre: 'SEAL123', vgm: '25000', inspecionado: true, novo_lacre: 'FJ22391479' },
            { id: 2, numero: 'MSNU5520181', lacre: 'SEAL124', vgm: '25100', inspecionado: true, novo_lacre: 'FJ22391480' },
            { id: 3, numero: 'MSAU2468135', lacre: 'SEAL125', vgm: '24950', inspecionado: false, novo_lacre: '' },
        ],
        nf_remessa: '14575, 14579, 14582',
        nf_retorno: '16109',
        nf_exportacao: '55670',
        due_numero: '24BR0001234567',
        due_status: 'Desembaraçada',
        lpco_protocolo: 'E2500273876',
        mapa_status: 'Deferido',
        bl_master: 'MEDUHI295369',
        navio_final: 'MSC AMALFI',
        viagem_final: 'NA522R',
        documentos_originais: [
            { id: 'bl_original', name: 'Coletar Bill of Lading (B/L) Original', done: true },
            { id: 'coo_original', name: 'Emitir Certificado de Origem (COO) Original', done: true },
            { id: 'fito_original', name: 'Emitir Certificado Fitossanitário (FITO) Original', done: false },
            { id: 'pagamento_cert', name: 'Processar Pagamento de Certificados', done: true, isSubtask: true },
        ],
        awb_courier: '',
    }
];

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status.includes('Aguardando') || status.includes('EM_APROVAÇÃO') || status.includes('Iniciado')) return 'secondary';
    if (status.includes('Confirmado') || status.includes('APROVADOS') || status.includes('Desembaraçada') || status.includes('Deferido') || status.includes('Realizada') || status.includes('trânsito')) return 'default';
    if (status.includes('Atrasado') || status.includes('Cancelado') || status.includes('CORRECAO') || status.includes('Indeferido')) return 'destructive';
    if (status.includes('Concluído') || status.includes('PRONTO')) return 'outline';
    return 'default';
}

export default function GestaoProcessosPage() {
  const [processos, setProcessos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedProcessos = localStorage.getItem('processos');
    if (storedProcessos && JSON.parse(storedProcessos).length > 0) {
      setProcessos(JSON.parse(storedProcessos));
    } else {
        localStorage.setItem('processos', JSON.stringify(initialProcessos));
        setProcessos(initialProcessos);
    }
  }, []);

  const handleDelete = (id: number) => {
    const updatedProcessos = processos.filter(p => p.id !== id);
    setProcessos(updatedProcessos);
    localStorage.setItem('processos', JSON.stringify(updatedProcessos));
  };
  
  const filteredProcessos = processos.filter(processo => 
      (processo.processo_interno && processo.processo_interno.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (processo.exportadorNome && processo.exportadorNome.toLowerCase().includes(searchTerm.toLowerCase()))
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
                placeholder="Buscar por Processo ou Cliente..." 
                className="pl-8" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Processo Interno</TableHead>
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
                <TableCell className="font-medium">{processo.processo_interno}</TableCell>
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
