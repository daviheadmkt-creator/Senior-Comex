
'use client';

import { useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
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

function ClientEmbarquesContent() {
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading: isAuthLoading } = useUser();

  const exportadorIdFromParams = searchParams.get('exportadorId');

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: currentUserData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const clientId = useMemo(() => {
    if (!currentUserData) return null;
    // If the user is an admin/internal, they can view any client via URL param.
    if (currentUserData.funcao !== 'Cliente') {
      return exportadorIdFromParams;
    }
    // If the user is a client, they can ONLY see their own data.
    return currentUserData.partnerId;
  }, [currentUserData, exportadorIdFromParams]);


  const processosQuery = useMemoFirebase(() => {
    if (!firestore || !clientId) return null; // Don't query if no client ID is available
    return query(
        collection(firestore, 'processos'), 
        where('exportadorId', '==', clientId),
        where('status', 'not-in', ['Concluído', 'Cancelado'])
    );
  }, [firestore, clientId]);

  const { data: processosAtivos, isLoading: isLoadingProcessos } = useCollection(processosQuery);

  const isLoading = isAuthLoading || isUserDocLoading || isLoadingProcessos;

  const clientName = useMemo(() => {
    if (!isLoading && processosAtivos && processosAtivos.length > 0) {
      return processosAtivos[0].exportadorNome;
    }
    if (!isLoading && currentUserData?.funcao === 'Cliente') {
        return currentUserData.nome;
    }
    return null;
  }, [processosAtivos, currentUserData, isLoading]);

  const handleRowClick = (processoId: string) => {
    router.push(`/portal/documentos?processo_id=${processoId}&exportadorId=${clientId}`);
  }

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-24 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          </TableCell>
        </TableRow>
      );
    }

    if (!clientId) {
        return (
             <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Nenhum cliente associado à sua conta ou selecionado para visualização.
                </TableCell>
            </TableRow>
        )
    }
    
    if (!processosAtivos || processosAtivos.length === 0) {
        return (
             <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhum embarque ativo encontrado para este cliente.
                </TableCell>
              </TableRow>
        )
    }

    return processosAtivos.map((processo) => (
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
    ));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{clientName ? `Embarques de ${clientName}` : 'Meus Embarques Ativos'}</CardTitle>
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
            {renderTableBody()}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


export default function ClientEmbarquesPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <ClientEmbarquesContent />
        </Suspense>
    )
}
