
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


const initialProducts: any[] = [
    {
        id: 1,
        descricao: 'Gergelim',
        descricao_en: 'SESAME SEEDS',
        ncm: '12074090',
        unidade: 'KG',
        peso_padrao: '50',
        embalagem_padrao: 'Sacos de polipropileno branco',
    },
    {
        id: 2,
        descricao: 'Soja em Grãos',
        descricao_en: 'SOYBEANS',
        ncm: '12019000',
        unidade: 'KG',
        peso_padrao: '60',
        embalagem_padrao: 'Sacos de polipropileno',
    }
];


export default function ListaProdutosPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts && JSON.parse(storedProducts).length > 0) {
      setProducts(JSON.parse(storedProducts));
    } else {
      localStorage.setItem('products', JSON.stringify(initialProducts));
      setProducts(initialProducts);
    }
  }, []);

  const handleDelete = (id: number) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>
              Gerencie o catálogo de produtos que sua empresa exporta.
            </CardDescription>
          </div>
          <Link href="/dashboard/dados-referencia/produtos/novo" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por descrição do produto..." className="pl-8" />
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>NCM</TableHead>
              <TableHead>Unidade de Medida</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.descricao}</TableCell>
                <TableCell>{product.ncm}</TableCell>
                <TableCell>{product.unidade}</TableCell>
                <TableCell>
                    <div className='flex gap-2'>
                        <Link href={`/dashboard/dados-referencia/produtos/novo?id=${product.id}&edit=true`} passHref>
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
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o produto
                                e removerá seus dados de nossos servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(product.id)}>Excluir</AlertDialogAction>
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
