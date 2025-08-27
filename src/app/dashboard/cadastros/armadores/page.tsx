
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


const armadores = [
  {
    id: 1,
    nome: 'MSC',
    contatoPrincipal: 'João Carlos',
    terminais: 'Porto de Santos, Porto de Paranaguá',
  },
  {
    id: 2,
    nome: 'Maersk Line',
    contatoPrincipal: 'Ana Beatriz',
    terminais: 'Porto de Itajaí, Porto de Rio Grande',
  },
  {
    id: 3,
    nome: 'CMA CGM',
    contatoPrincipal: 'Pedro Almeida',
    terminais: 'Porto de Suape, Porto de Pecém',
  },
  {
    id: 4,
    nome: 'Hapag-Lloyd',
    contatoPrincipal: 'Mariana Costa',
    terminais: 'Porto do Rio de Janeiro, Porto de Itapoá',
  },
];


export default function ListaArmadoresPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Armadores / Agentes</CardTitle>
            <CardDescription>
              Gerencie os armadores e agentes da sua empresa.
            </CardDescription>
          </div>
          <Link href="/dashboard/cadastros/armadores/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Armador
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome do armador..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Armador</TableHead>
              <TableHead>Contato Principal</TableHead>
              <TableHead>Terminais de Atuação</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {armadores.map((armador) => (
              <TableRow key={armador.id}>
                <TableCell className="font-medium">{armador.nome}</TableCell>
                <TableCell>{armador.contatoPrincipal}</TableCell>
                <TableCell>{armador.terminais}</TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                        <Link href={`/dashboard/cadastros/armadores/novo?id=${armador.id}&edit=true`} passHref>
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
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o armador
                                e removerá seus dados de nossos servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction>Excluir</AlertDialogAction>
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
