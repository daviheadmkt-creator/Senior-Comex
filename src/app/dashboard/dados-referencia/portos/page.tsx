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

export default function PortosPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    
    const portsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'ports') : null, [firestore]);
    const { data: ports, isLoading } = useCollection(portsCollection);

    const [formData, setFormData] = useState({ name: '', un_locode: '', country: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (!firestore || !formData.name) return;
        const docId = editingId || doc(collection(firestore, 'ports')).id;
        setDocumentNonBlocking(doc(firestore, 'ports', docId), { ...formData, id: docId }, { merge: true });
        toast({ title: "Sucesso!", description: "Porto salvo." });
        setFormData({ name: '', un_locode: '', country: '' });
        setEditingId(null);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !firestore) return;
        const XLSX = await import('xlsx');
        setIsImporting(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const workbook = XLSX.read(new Uint8Array(e.target?.result as ArrayBuffer), { type: 'array' });
                const json: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                json.forEach(row => {
                    if (row.name) {
                        const id = doc(collection(firestore, 'ports')).id;
                        setDocumentNonBlocking(doc(firestore, 'ports', id), { id, name: String(row.name), un_locode: String(row.un_locode || ''), country: String(row.country || '') }, { merge: true });
                    }
                });
                toast({ title: 'Sucesso', description: `${json.length} portos importados.` });
            } catch { toast({ title: 'Erro', description: 'Falha na importação.', variant: 'destructive' }); }
            finally { setIsImporting(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card><CardHeader><CardTitle>Portos</CardTitle></CardHeader>
                    <CardContent><Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>UN/LOCODE</TableHead><TableHead>País</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
                    <TableBody>{isLoading ? <TableRow><TableCell colSpan={4}><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow> : ports?.map(p => (
                        <TableRow key={p.id}><TableCell>{p.name}</TableCell><TableCell>{p.un_locode}</TableCell><TableCell>{p.country}</TableCell>
                        <TableCell><div className='flex gap-2'><Button variant="outline" size="icon" onClick={() => { setEditingId(p.id); setFormData({name: p.name, un_locode: p.un_locode, country: p.country}); }}><Edit className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => deleteDocumentNonBlocking(doc(firestore, 'ports', p.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell></TableRow>
                    ))}</TableBody></Table></CardContent></Card>
                </div>
                <div className="space-y-6">
                    <Card><CardHeader><CardTitle>{editingId ? 'Editar' : 'Novo'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>Nome</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                        <div className="space-y-2"><Label>UN/LOCODE</Label><Input value={formData.un_locode} onChange={e => setFormData({...formData, un_locode: e.target.value})} /></div>
                        <div className="space-y-2"><Label>País</Label><Input value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} /></div>
                        <Button className="w-full" onClick={handleSave}>{editingId ? 'Atualizar' : 'Adicionar'}</Button>
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle>Importação</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx, .xls" />
                        <Button className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>{isImporting ? <Loader2 className="animate-spin mr-2" /> : <FileUp className="mr-2" />}Importar XLSX</Button>
                    </CardContent></Card>
                </div>
            </div>
        </div>
    );
}