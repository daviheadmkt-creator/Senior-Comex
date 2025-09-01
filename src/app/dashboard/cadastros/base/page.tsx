
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
import { PlusCircle, Search, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useEffect, useState } from 'react';


const initialCadastros: any[] = [];


export default function ListaCadastroBasePage() {
  const [cadastros, setCadastros] = useState(initialCadastros);
  
  useEffect(() => {
    const storedCadastros = localStorage.getItem('base_cadastros');
    if (storedCadastros) {
        setCadastros(JSON.parse(storedCadastros));
    } else {
        localStorage.setItem('base_cadastros', JSON.stringify(initialCadastros));
    }
  }, []);

  const handleDelete = (id: number) => {
    const updatedCadastros = cadastros.filter(c => c.id !== id);
    setCadastros(updatedCadastros);
    localStorage.setItem('base_cadastros', JSON.stringify(updatedCadastros));
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Cadastro Base</CardTitle>
            <CardDescription>
              Gerencie os cadastros base da sua empresa.
            </CardDescription>
          </div>
          <Link href="/dashboard/cadastros/base/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Cadastro
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Contato Principal</TableHead>
              <TableHead>Terminais de Atuação</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cadastros.map((cadastro) => (
              <TableRow key={cadastro.id}>
                <TableCell className="font-medium">{cadastro.nome}</TableCell>
                <TableCell>{cadastro.tipo}</TableCell>
                <TableCell>{cadastro.contatoPrincipal}</TableCell>
                <TableCell>{cadastro.terminais}</TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                        <Link href={`/dashboard/cadastros/base/novo?id=${cadastro.id}&edit=true`} passHref>
                            <Button variant="outline" size="icon" className="text-green-600 hover:text-green-700">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700">
                                 <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o cadastro
                                e removerá seus dados de nossos servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(cadastro.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
