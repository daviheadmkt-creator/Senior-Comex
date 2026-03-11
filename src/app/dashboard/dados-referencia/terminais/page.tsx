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
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, PlusCircle, Trash2, Loader2, FileUp, Download } from 'lucide-react';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import * as XLSX from 'xlsx';


export default function TerminaisPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    
    const terminalsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'terminals') : null, [firestore]);
    const { data: terminals, isLoading: isLoadingTerminals } = useCollection(terminalsCollection);

    const [formData, setFormData] = useState({ name: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    }

    const handleSave = () => {
        if(!firestore) return;
        if (!formData.name) {
            toast({
                title: "Erro",
                description: "Preencha o nome do terminal.",
                variant: "destructive",
            });
            return;
        }

        const docId = editingId || doc(collection(firestore, 'terminals')).id;
        const terminalRef = doc(firestore, 'terminals', docId);

        setDocumentNonBlocking(terminalRef, { ...formData, id: docId }, { merge: true });
        
        toast({
            title: "Sucesso!",
            description: `Terminal ${editingId ? 'atualizado' : 'adicionado'}.`,
        });

        setFormData({ name: '' });
        setEditingId(null);
    };

    const handleEdit = (terminal: any) => {
        setEditingId(terminal.id);
        setFormData({ name: terminal.name });
    };

    const handleDelete = (id: string) => {
        if (!firestore) return;
        deleteDocumentNonBlocking(doc(firestore, 'terminals', id));
        toast({
            title: "Sucesso!",
            description: "Terminal excluído.",
            variant: "default",
        });
    };

    const handleCancel = () => {
        setFormData({ name: '' });
        setEditingId(null);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !firestore) return;

        setIsImporting(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);

                let importedCount = 0;
                json.forEach(row => {
                    const terminalName = String(row.name || row.nome || row.terminal || '').trim();
                    
                    if (terminalName) {
                        const docId = doc(collection(firestore, 'terminals')).id;
                        const terminalRef = doc(firestore, 'terminals', docId);
                        setDocumentNonBlocking(terminalRef, { 
                            id: docId,
                            name: terminalName,
                        }, { merge: true });
                        importedCount++;
                    }
                });

                toast({
                    title: 'Importação Concluída',
                    description: `${importedCount} terminais foram importados com sucesso.`,
                });
            } catch (error) {
                console.error("Erro ao importar planilha:", error);
                toast({
                    title: 'Erro na Importação',
                    description: 'Houve um problema ao ler o ficheiro. Verifique o formato e tente novamente.',
                    variant: 'destructive',
                });
            } finally {
                setIsImporting(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleDownloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            { name: "Terminal Exemplo A" },
            { name: "Terminal Exemplo B" },
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Terminais");
        XLSX.writeFile(wb, "template_terminais.xlsx");
    };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Terminais Cadastrados</CardTitle>
                    <CardDescription>Gerencie a lista de terminais de embarque e descarga.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome do Terminal</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingTerminals && <TableRow><TableCell colSpan={2} className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>}
                            {!isLoadingTerminals && terminals?.map((terminal) => (
                                <TableRow key={terminal.id}>
                                    <TableCell className="font-medium text-primary uppercase">{terminal.name}</TableCell>
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            <Button variant="outline" size="icon" onClick={() => handleEdit(terminal)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="outline" size="icon" onClick={() => handleDelete(terminal.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!isLoadingTerminals && (!terminals || terminals.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">Nenhum terminal cadastrado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? 'Editar Terminal' : 'Novo Terminal'}</CardTitle>
                    <CardDescription>{editingId ? 'Altere os dados do terminal.' : 'Adicione um novo terminal.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Terminal</Label>
                            <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Ex: TCP" className="uppercase" />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Button type="submit" className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {editingId ? 'Salvar Alterações' : 'Adicionar Terminal'}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" className="w-full" onClick={handleCancel}>
                                    Cancelar Edição
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Cadastro em Massa</CardTitle>
                    <CardDescription>Importe múltiplos terminais de um ficheiro XLSX.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".xlsx, .xls"
                    />
                    <Button onClick={handleImportClick} disabled={isImporting} className="w-full">
                        {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                        {isImporting ? 'A Importar...' : 'Importar em Massa (XLSX)'}
                    </Button>
                     <Button onClick={handleDownloadTemplate} variant="secondary" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Descarregar Template
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
