
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
import { useState, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import * as XLSX from 'xlsx';


export default function PortosPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    
    const portsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'ports') : null, [firestore]);
    const { data: ports, isLoading } = useCollection(portsCollection);

    const [formData, setFormData] = useState({ name: '', un_locode: '', country: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    }

    const handleSave = () => {
        if (!firestore) return;
        if (!formData.name || !formData.un_locode || !formData.country) {
            toast({
                title: "Erro",
                description: "Por favor, preencha todos os campos.",
                variant: "destructive",
            });
            return;
        }

        const docId = editingId || doc(collection(firestore, 'ports')).id;
        const portRef = doc(firestore, 'ports', docId);

        setDocumentNonBlocking(portRef, { ...formData, id: docId }, { merge: true });
        
        toast({
            title: "Sucesso!",
            description: `Porto ${editingId ? 'atualizado' : 'adicionado'}.`,
        });

        setFormData({ name: '', un_locode: '', country: '' });
        setEditingId(null);
    };

    const handleEdit = (port: any) => {
        setEditingId(port.id);
        setFormData({ name: port.name, un_locode: port.un_locode, country: port.country });
    };

    const handleDelete = (id: string) => {
        if (!firestore) return;
        deleteDocumentNonBlocking(doc(firestore, 'ports', id));
        toast({
            title: "Sucesso!",
            description: "Porto excluído.",
            variant: "default",
        });
    };

    const handleCancel = () => {
        setFormData({ name: '', un_locode: '', country: '' });
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
                    if (row.name && row.un_locode && row.country) {
                        const docId = doc(collection(firestore, 'ports')).id;
                        const portRef = doc(firestore, 'ports', docId);
                        setDocumentNonBlocking(portRef, { 
                            id: docId,
                            name: String(row.name), 
                            un_locode: String(row.un_locode), 
                            country: String(row.country) 
                        }, { merge: true });
                        importedCount++;
                    }
                });

                toast({
                    title: 'Importação Concluída',
                    description: `${importedCount} portos foram importados com sucesso.`,
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
            { name: "Paranaguá", un_locode: "BRPNG", country: "Brasil" },
            { name: "Shanghai", un_locode: "CNSHA", country: "China" },
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Portos");
        XLSX.writeFile(wb, "template_portos.xlsx");
    };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Portos Cadastrados (Total: {isLoading ? '...' : ports?.length ?? 0})</CardTitle>
                    <CardDescription>Gerencie os portos de embarque e descarga.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome do Porto</TableHead>
                                <TableHead>UN/LOCODE</TableHead>
                                <TableHead>País</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>}
                            {!isLoading && ports?.map((port) => (
                                <TableRow key={port.id}>
                                    <TableCell className="font-medium">{port.name}</TableCell>
                                    <TableCell>{port.un_locode}</TableCell>
                                    <TableCell>{port.country}</TableCell>
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            <Button variant="outline" size="icon" onClick={() => handleEdit(port)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="outline" size="icon" onClick={() => handleDelete(port.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!isLoading && ports?.length === 0 && (
                                 <TableRow>
                                     <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum porto cadastrado.</TableCell>
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
                    <CardTitle>{editingId ? 'Editar Porto' : 'Novo Porto'}</CardTitle>
                    <CardDescription>{editingId ? 'Altere os dados do porto.' : 'Adicione um novo porto.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Porto</Label>
                            <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Ex: Paranaguá" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="un_locode">Código UN/LOCODE</Label>
                            <Input id="un_locode" value={formData.un_locode} onChange={(e) => handleInputChange('un_locode', e.target.value)} placeholder="Ex: BRPNG" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">País</Label>
                            <Input id="country" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} placeholder="Ex: Brasil" />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Button type="submit" className="w-full">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {editingId ? 'Salvar Alterações' : 'Adicionar Porto'}
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
                    <CardDescription>Importe múltiplos portos de um ficheiro XLSX.</CardDescription>
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
