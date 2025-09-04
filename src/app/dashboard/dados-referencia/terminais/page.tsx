
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
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TerminaisPage() {
    const { toast } = useToast();
    const [terminals, setTerminals] = useState<any[]>([]);
    const [ports, setPorts] = useState<any[]>([]);
    const [formData, setFormData] = useState({ name: '', portoId: '' });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        const storedTerminals = localStorage.getItem('terminals');
        if (storedTerminals) {
            setTerminals(JSON.parse(storedTerminals));
        }
        const storedPorts = localStorage.getItem('ports');
        if (storedPorts) {
            setPorts(JSON.parse(storedPorts));
        }
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    }

    const handleSave = () => {
        if (!formData.name || !formData.portoId) {
            toast({
                title: "Erro",
                description: "Preencha todos os campos.",
                variant: "destructive",
            });
            return;
        }

        let updatedTerminals;
        const portName = ports.find(p => String(p.id) === formData.portoId)?.name || 'N/A';
        const dataToSave = { ...formData, portName };

        if (editingId !== null) {
            // Edit
            updatedTerminals = terminals.map(t => t.id === editingId ? {id: editingId, ...dataToSave} : t);
        } else {
            // Add
            const newId = terminals.length > 0 ? Math.max(...terminals.map(t => t.id)) + 1 : 1;
            updatedTerminals = [...terminals, { id: newId, ...dataToSave }];
        }
        setTerminals(updatedTerminals);
        localStorage.setItem('terminals', JSON.stringify(updatedTerminals));
        
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

    const handleDelete = (id: number) => {
        const updatedTerminals = terminals.filter(t => t.id !== id);
        setTerminals(updatedTerminals);
        localStorage.setItem('terminals', JSON.stringify(updatedTerminals));
        toast({
            title: "Sucesso!",
            description: "Terminal excluído.",
            variant: "destructive",
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
                            {terminals.map((terminal) => (
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
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Terminal</Label>
                            <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Ex: TCP" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portoId">Porto</Label>
                            <Select value={formData.portoId} onValueChange={(value) => handleInputChange('portoId', value)}>
                                <SelectTrigger id="portoId">
                                    <SelectValue placeholder="Selecione o porto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ports.map((port) => (
                                        <SelectItem key={port.id} value={String(port.id)}>
                                            {port.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Button type="button" className="w-full" onClick={handleSave}>
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
