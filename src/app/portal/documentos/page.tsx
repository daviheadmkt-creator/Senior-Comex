
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DownloadCloud, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function ClientDocumentsPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading: isAuthLoading } = useUser();

  const processoIdFromParam = searchParams.get('processo_id');
  const exportadorIdFromParam = searchParams.get('exportadorId'); 

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: currentUserData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const clientId = useMemo(() => {
    if (!currentUserData) return null;
    if (currentUserData.funcao !== 'Cliente') {
      return exportadorIdFromParam || null;
    }
    return currentUserData.partnerId || null;
  }, [currentUserData, exportadorIdFromParam]);

  const processosCollection = useMemoFirebase(() => {
    if (!firestore || !clientId) return null;
    return query(
      collection(firestore, 'processos'),
      where('exportadorId', '==', clientId)
    );
  }, [firestore, clientId]);

  const { data: processos, isLoading: isLoadingProcessos } = useCollection(processosCollection);
  const isLoading = isAuthLoading || isUserDocLoading || isLoadingProcessos;

  const selectedProcessoId = processoIdFromParam || (processos && processos.length > 0 ? processos[0].id : '');

  const handleSelectChange = (newProcessoId: string) => {
    router.push(`/portal/documentos?processo_id=${newProcessoId}&exportadorId=${clientId}`);
  };


  const selectedProcesso = useMemo(() => {
    if (!processos || !selectedProcessoId) return null;
    return processos.find(p => p.id === selectedProcessoId);
  }, [processos, selectedProcessoId]);

  const documents = useMemo(() => {
    if (!selectedProcesso) return [];
    
    const docs: { name: string; file: { name: string; url: string } }[] = [];
    
    if (selectedProcesso.draft_bl_file) docs.push({ name: 'Draft: Bill of Lading (BL)', file: selectedProcesso.draft_bl_file });
    if (selectedProcesso.draft_fito_file) docs.push({ name: 'Draft: Certificado Fitossanitário', file: selectedProcesso.draft_fito_file });
    if (selectedProcesso.draft_co_file) docs.push({ name: 'Draft: Certificado de Origem', file: selectedProcesso.draft_co_file });
    
    if (selectedProcesso.due_file) docs.push({ name: 'DUE (Declaração Única de Exportação)', file: selectedProcesso.due_file });
    if (selectedProcesso.lpco_file) docs.push({ name: 'LPCO (Licenças, Permissões, Certificados e Outros)', file: selectedProcesso.lpco_file });

    if (selectedProcesso.documentos_pos_embarque) {
        selectedProcesso.documentos_pos_embarque.forEach((doc: any) => {
            if (doc.file) {
                docs.push({ name: doc.nome, file: doc.file });
            }
        });
    }

    return docs;
  }, [selectedProcesso]);


  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Meus Documentos</CardTitle>
            <CardDescription>
              Faça o download dos documentos relacionados aos seus embarques.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm mb-6">
                <Label htmlFor="embarque-select">Selecione um Embarque</Label>
                 <Select 
                    value={selectedProcessoId} 
                    onValueChange={handleSelectChange}
                    disabled={isLoading || !processos || processos.length === 0}
                >
                    <SelectTrigger id="embarque-select">
                        <SelectValue placeholder={isLoading ? 'A carregar embarques...' : 'Selecione um embarque'} />
                    </SelectTrigger>
                    <SelectContent>
                        {processos?.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                                {p.processo_interno || p.po_number || p.id}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Documento</TableHead>
                  <TableHead>Ficheiro</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                        </TableCell>
                    </TableRow>
                )}
                {!isLoading && selectedProcesso && documents.length > 0 && documents.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.file.name}</TableCell>
                    <TableCell className="text-right">
                        <a 
                            href={doc.file.url} 
                            download={doc.file.name}
                            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                        >
                            <DownloadCloud className="mr-2 h-4 w-4" />
                            Download
                        </a>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && (!selectedProcessoId || !selectedProcesso || documents.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                            Nenhum documento disponível para este embarque.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
