
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
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';


export default function TerminaisPage() {
    const { toast } = useToast();
    const firestore = useFirestore();
    
    const terminalsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'terminals') : null, [firestore]);
    const { data: terminals, isLoading: isLoadingTerminals } = useCollection(terminalsCollection);
    
    const portsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'ports') : null, [firestore]);
    const { data: ports, isLoading: isLoadingPorts } = useCollection(portsCollection);

    const [formData, setFormData] = useState({ name: '', portoId: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    const terminalsWithPortNames = useMemo(() => {
        if (!terminals || !ports) return [];
        return terminals.map(terminal => {
            const port = ports.find(p => p.id === terminal.portoId);
            return {
                ...terminal,
                portName: port ? port.name : 'N/A'
            };
        });
    }, [terminals, ports]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    }

    const handleSave = () => {
        if(!firestore) return;
        if (!formData.name || !formData.portoId) {
            toast({
                title: "Erro",
                description: "Preencha todos os campos.",
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

        setFormData({ name: '', portoId: '' });
        setEditingId(null);
    };

    const handleEdit = (terminal: any) => {
        setEditingId(terminal.id);
        setFormData({ name: terminal.name, portoId: String(terminal.portoId) });
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
        setFormData({ name: '', portoId: '' });
        setEditingId(null);
    }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Terminais Cadastrados</CardTitle>
                    <CardDescription>Gerencie os terminais de estufagem e embarque.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome do Terminal</TableHead>
                                <TableHead>Porto Vinculado</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(isLoadingTerminals || isLoadingPorts) && <TableRow><TableCell colSpan={3} className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>}
                            {!(isLoadingTerminals || isLoadingPorts) && terminalsWithPortNames.map((terminal) => (
                                <TableRow key={terminal.id}>
                                    <TableCell className="font-medium">{terminal.name}</TableCell>
                                    <TableCell>{terminal.portName}</TableCell>
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            <Button variant="outline" size="icon" onClick={() => handleEdit(terminal)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="outline" size="icon" onClick={() => handleDelete(terminal.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!(isLoadingTerminals || isLoadingPorts) && terminalsWithPortNames.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">Nenhum terminal cadastrado.</TableCell>
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
                    <CardTitle>{editingId ? 'Editar Terminal' : 'Novo Terminal'}</CardTitle>
                    <CardDescription>{editingId ? 'Altere os dados do terminal.' : 'Adicione um novo terminal.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Terminal</Label>
                            <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Ex: TCP" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portoId">Porto</Label>
                            <Select value={formData.portoId} onValueChange={(value) => handleInputChange('portoId', value)}>
                                <SelectTrigger id="portoId">
                                    <SelectValue placeholder={isLoadingPorts ? 'Carregando...' : 'Selecione o porto'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {ports?.map((port) => (
                                        <SelectItem key={port.id} value={String(port.id)}>
                                            {port.name}
                                        </SelectItem>
                                    ))}
                                    {ports?.length === 0 && <p className="p-2 text-sm text-muted-foreground">Nenhum porto cadastrado</p>}
                                </SelectContent>
                            </Select>
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
        </div>
      </div>
    </div>
  );
}

    