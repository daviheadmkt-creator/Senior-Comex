
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
import { PlusCircle, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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


const initialPartners: any[] = [
    {
        id: 1,
        razao_social: 'AGRICOLA FERRARI LTDA',
        nome_fantasia: 'AGRICOLA FERRARI',
        cnpj: '91.748.483/0001-62',
        tipo_parceiro: 'Exportador',
        endereco: 'Rua Principal, 123',
        cidade: 'Canarana',
        estado: 'MT',
        cep: '78640-000',
        pais: 'Brasil',
        contatos: [{ nome: 'Ricardo Rossi', email: 'ricardo@agricolaferrari.com.br', telefone: '11999999999', cargo: 'Contador' }],
    },
    {
        id: 2,
        razao_social: 'AL-TAWFEEK FOR IMPORT AND EXPORT',
        nome_fantasia: 'AL-TAWFEEK',
        cnpj: '303-352-442',
        tipo_parceiro: 'Cliente (Importador)',
        endereco: '123 Desert Street',
        cidade: 'Cairo',
        estado: '',
        cep: '',
        pais: 'Egito',
        contatos: [{ nome: 'Ahmed Ali', email: 'ahmed@altawfeek.com', telefone: '+201000000000', cargo: 'Import Manager' }],
    },
    {
        id: 3,
        razao_social: 'MSC MEDITERRANEAN SHIPPING COMPANY',
        nome_fantasia: 'MSC',
        cnpj: '02.378.892/0001-83',
        tipo_parceiro: 'Armador',
        endereco: 'Avenida Ana Costa, 291',
        cidade: 'Santos',
        estado: 'SP',
        cep: '11060-001',
        pais: 'Brasil',
        contatos: [{ nome: 'Contato MSC', email: 'contato@msc.com', telefone: '13999999999', cargo: 'Comercial' }],
    },
    {
        id: 4,
        razao_social: 'SENIOR ASSESSORIA EM COMERCIO EXTERIOR LTDA',
        nome_fantasia: 'SENIOR COMEX',
        cnpj: '03.884.978/0001-49',
        tipo_parceiro: 'Despachante Aduaneiro',
        endereco: 'Rua dos Despachantes, 456',
        cidade: 'Santos',
        estado: 'SP',
        cep: '11060-000',
        pais: 'Brasil',
        contatos: [{ nome: 'Claudimar Ceia', email: 'claudimar.ceia@senior-comex.com.br', telefone: '11965764516', cargo: 'Despachante' }],
    },
     {
        id: 5,
        razao_social: 'GRANELMAR LOGISTICA E ARMAZENS GERAIS LTDA',
        nome_fantasia: 'GRANELMAR',
        cnpj: '00.332.990/0001-26',
        tipo_parceiro: 'Terminal de Estufagem',
        endereco: 'Avenida Portuária, 789',
        cidade: 'Paranaguá',
        estado: 'PR',
        cep: '83203-210',
        pais: 'Brasil',
        contatos: [{ nome: 'Contato Granelmar', email: 'contato@granelmar.com', telefone: '41999999999', cargo: 'Operacional' }],
    }
];

export default function ListaParceirosPage() {
  const [partners, setPartners] = useState<any[]>([]);
  
  useEffect(() => {
    const storedPartners = localStorage.getItem('partners');
    if (storedPartners && JSON.parse(storedPartners).length > 0) {
        setPartners(JSON.parse(storedPartners));
    } else {
        localStorage.setItem('partners', JSON.stringify(initialPartners));
        setPartners(initialPartners);
    }
  }, []);

  const handleDelete = (id: number) => {
    const updatedPartners = partners.filter(c => c.id !== id);
    setPartners(updatedPartners);
    localStorage.setItem('partners', JSON.stringify(updatedPartners));
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Parceiros</CardTitle>
            <CardDescription>
              Gerencie todos os parceiros e envolvidos nos processos.
            </CardDescription>
          </div>
          <Link href="/dashboard/cadastros/parceiros/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Parceiro
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome ou CNPJ..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Fantasia</TableHead>
              <TableHead>Razão Social</TableHead>
              <TableHead>CNPJ / TAX ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell className="font-medium">{partner.nome_fantasia}</TableCell>
                <TableCell>{partner.razao_social}</TableCell>
                <TableCell>{partner.cnpj}</TableCell>
                <TableCell>
                    <Badge variant="outline">{partner.tipo_parceiro}</Badge>
                </TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                         <Link href={`/dashboard/cadastros/parceiros/novo?id=${partner.id}&edit=true`} passHref>
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
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o parceiro
                                e removerá seus dados de nossos servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(partner.id)}>Excluir</AlertDialogAction>
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
