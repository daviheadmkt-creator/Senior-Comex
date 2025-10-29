
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
import { Edit, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';


export default function PortosPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    
    const portsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'ports') : null, [firestore]);
    const { data: portsFromDb, isLoading } = useCollection(portsCollection);

    const [formData, setFormData] = useState({ name: '', un_locode: '', country: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    const initialPorts = [
      { id: 'AEAJM', name: 'AJMAN', un_locode: 'AEAJM', country: 'United Arab Emirates' }
    ];

    const combinedPorts = useMemo(() => {
        if (!portsFromDb) return initialPorts;
        const dbIds = new Set(portsFromDb.map(p => p.id));
        const uniqueInitialPorts = initialPorts.filter(p => !dbIds.has(p.id));
        return [...uniqueInitialPorts, ...portsFromDb];
    }, [portsFromDb]);


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
        // Do not allow deleting the hardcoded initial port from the UI logic
        if (initialPorts.some(p => p.id === id)) {
             toast({
                title: "Ação não permitida",
                description: "Não é possível excluir um registo de amostra.",
                variant: "destructive",
            });
            return;
        }
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

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Portos Cadastrados</CardTitle>
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
                            {!isLoading && combinedPorts?.map((port) => (
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
                             {!isLoading && combinedPorts?.length === 0 && (
                                 <TableRow>
                                     <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum porto cadastrado.</TableCell>
                                 </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div>
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
        </div>
      </div>
    </div>
  );
}
