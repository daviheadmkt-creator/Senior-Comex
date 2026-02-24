
'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, Download, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';

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

const DocumentList = ({ processo }: { processo: any }) => {
    const documents = useMemo(() => {
        const docs: { name: string; file: any }[] = [];

        // Drafts
        if (processo.draft_bl_file) docs.push({ name: "Draft BL", file: processo.draft_bl_file });
        if (processo.draft_fito_file) docs.push({ name: "Draft Fito", file: processo.draft_fito_file });
        if (processo.draft_co_file) docs.push({ name: "Draft C.O.", file: processo.draft_co_file });
        
        // Fiscal / Customs
        if (processo.due_file) docs.push({ name: "DUE", file: processo.due_file });
        if (processo.lpco_file) docs.push({ name: "LPCO (MAPA)", file: processo.lpco_file });
        
        // Post-shipment
        processo.documentos_pos_embarque?.forEach((doc: any) => {
            if (doc.file) docs.push({ name: doc.nome, file: doc.file });
        });

        // Fiscal Notes
        processo.notas_fiscais?.forEach((nf: any, index: number) => {
            if (nf.file) docs.push({ name: `Nota Fiscal (${nf.tipo || 'N/A'}) #${index + 1}`, file: nf.file });
        });

        // Deadline proofs
        if (processo.deadline_draft_file) docs.push({ name: "Comprovante Deadline Draft", file: processo.deadline_draft_file });
        if (processo.deadline_vgm_file) docs.push({ name: "Comprovante Deadline VGM", file: processo.deadline_vgm_file });
        if (processo.deadline_carga_file) docs.push({ name: "Comprovante Deadline Carga", file: processo.deadline_carga_file });

        return docs;
    }, [processo]);

    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-lg">Documentos Anexados</h4>
            {documents.length > 0 ? (
                <div className="grid gap-2">
                    {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between rounded-md border p-3">
                             <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div className="flex flex-col">
                                     <span className="font-medium">{doc.name}</span>
                                     <span className="text-xs text-muted-foreground">{doc.file.name}</span>
                                </div>
                            </div>
                            <a href={doc.file.dataUrl} download={doc.file.name} title={`Baixar ${doc.file.name}`}>
                                <Button variant="ghost" size="icon">
                                    <Download className="h-5 w-5" />
                                </Button>
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum documento disponível para este processo.</p>
            )}
        </div>
    );
};


export default function PortalClientePage() {
    const params = useParams();
    const partnerId = params.partnerId as string;
    const firestore = useFirestore();

    const partnerDocRef = useMemoFirebase(() => (firestore && partnerId) ? doc(firestore, 'partners', partnerId) : null, [firestore, partnerId]);
    const { data: partner, isLoading: isLoadingPartner } = useDoc(partnerDocRef);

    const processosQuery = useMemoFirebase(() => (firestore && partnerId) ? query(collection(firestore, 'processos'), where('exportadorId', '==', partnerId)) : null, [firestore, partnerId]);
    const { data: processos, isLoading: isLoadingProcessos } = useCollection(processosQuery);

    const isLoading = isLoadingPartner || isLoadingProcessos;

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!partner) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Acesso Inválido</CardTitle>
                        <CardDescription>O portal que você está tentando acessar não foi encontrado. Verifique o link ou entre em contato com o suporte.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <header className="flex items-center justify-between mb-8">
                <div className="text-primary h-10 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" className="h-full w-auto">
                        <path fill="currentColor" d="M20 40C9 40 0 31 0 20S9 0 20 0s20 9 20 20-9 20-20 20zm-4.3-7.7L25 22.6a1.4 1.4 0 000-2.3L15.7 10a1.4 1.4 0 00-2.3 0L3.7 20l9.7 7.7a1.4 1.4 0 002.3 0zM24.3 30L15 22.6a1.4 1.4 0 010-2.3L24.3 10a1.4 1.4 0 012.3 0L36.3 20l-9.7 7.7a1.4 1.4 0 01-2.3 0z"/>
                        <text x="50" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="currentColor">senior</text>
                        <text x="50" y="36" fontFamily="sans-serif" fontSize="9" fill="currentColor">Assessoria em Comércio Exterior Ltda</text>
                    </svg>
                </div>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Portal do Cliente: {partner.nome_fantasia || partner.razao_social}</CardTitle>
                    <CardDescription>Acompanhe todos os seus processos de exportação em tempo real.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Processo</TableHead>
                                <TableHead>PO</TableHead>
                                <TableHead>Produto</TableHead>
                                <TableHead>Navio</TableHead>
                                <TableHead>Destino</TableHead>
                                <TableHead>ETA</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {processos && processos.length > 0 ? (
                                processos.map((processo) => (
                                    <TableRow key={processo.id}>
                                        <TableCell className="font-medium">{processo.processo_interno}</TableCell>
                                        <TableCell>{processo.po_number}</TableCell>
                                        <TableCell>{processo.produtoNome}</TableCell>
                                        <TableCell>{processo.navio}</TableCell>
                                        <TableCell>{processo.destino}</TableCell>
                                        <TableCell>{formatDate(processo.eta)}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(processo.status)}>{processo.status}</Badge></TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> Detalhes</Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-xl max-h-[80svh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Detalhes do Processo: {processo.processo_interno}</DialogTitle>
                                                        <DialogDescription>
                                                            Informações e documentos do processo.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <DocumentList processo={processo} />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24">Nenhum processo encontrado para este cliente.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
