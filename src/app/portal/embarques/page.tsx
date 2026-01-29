
'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';


const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return 'outline';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('trânsito') || lowerStatus.includes('confirmado') || lowerStatus.includes('aprovados') || lowerStatus.includes('desembaraçada') || lowerStatus.includes('deferido') || lowerStatus.includes('realizada')) return 'default';
    if (lowerStatus.includes('concluído') || lowerStatus.includes('pronto')) return 'outline';
    if (lowerStatus.includes('aguardando') || lowerStatus.includes('iniciado')) return 'secondary';
    if (lowerStatus.includes('atrasado') || lowerStatus.includes('cancelado') || lowerStatus.includes('correcao')) return 'destructive';
    return 'outline';
};

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
        return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
        return 'Data Inválida';
    }
}


export default function ClientEmbarquesPage() {
  const firestore = useFirestore();
  const router = useRouter();
  
  // For now, we will assume the client can see all active processes.
  // In a real implementation, this would be filtered by the client's ID.
  const processosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'processos'), where('status', 'not-in', ['Concluído', 'Cancelado']));
  }, [firestore]);

  const { data: processosAtivos, isLoading } = useCollection(processosQuery);

  const handleRowClick = (processoId: string) => {
      router.push(`/portal/documentos?processo_id=${processoId}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Embarques Ativos</CardTitle>
        <CardDescription>
          Acompanhe o status e os detalhes dos seus embarques em tempo real. Clique num embarque para ver os documentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO</TableHead>
              <TableHead>Analista (Cliente)</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Navio</TableHead>
              <TableHead>Origem / Destino</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Deadline Draft</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && processosAtivos && processosAtivos.map((processo) => (
              <TableRow 
                key={processo.id} 
                onClick={() => handleRowClick(processo.id)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{processo.po_number}</TableCell>
                <TableCell>
                    <div>{processo.analistaNome || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">{processo.exportadorNome}</div>
                </TableCell>
                <TableCell>{processo.produtoNome}</TableCell>
                <TableCell>{processo.navio}</TableCell>
                <TableCell>{processo.portoEmbarqueNome} / {processo.portoDescargaNome}</TableCell>
                <TableCell>{formatDate(processo.eta)}</TableCell>
                <TableCell>{formatDate(processo.deadline_draft)}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(processo.status)}>
                        {processo.status}
                    </Badge>
                </TableCell>
              </TableRow>
            ))}
             {!isLoading && (!processosAtivos || processosAtivos.length === 0) && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhum embarque ativo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
