
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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';


export default function NovoProdutoPage() {
  const searchParams = useSearchParams();
  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Produto' : 'Novo Produto';
  const pageDescription = isEditing
    ? 'Altere as informações do produto selecionado.'
    : 'Adicione um novo produto à sua base de dados.';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className='flex items-center gap-4'>
                <Link href="/dashboard/cadastros/produtos" passHref>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                <CardTitle>{pageTitle}</CardTitle>
                <CardDescription>
                    {pageDescription}
                </CardDescription>
                </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo-interno">Código Interno</Label>
                <Input id="codigo-interno" placeholder="Ex: FEJ-001" defaultValue={isEditing ? 'FEJ-001' : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input id="descricao" placeholder="Ex: Feijão Carioca Tipo 1" defaultValue={isEditing ? 'Feijão Carioca Tipo 1' : ''}/>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ncm">NCM / Classificação Fiscal</Label>
                <Input id="ncm" placeholder="Ex: 0713.33.19" defaultValue={isEditing ? '0713.33.19' : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade-medida">Unidade de Medida</Label>
                <Input id="unidade-medida" placeholder="Ex: SC 60kg, TN, KG" defaultValue={isEditing ? 'SC 60kg' : ''}/>
              </div>
            </div>

             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/cadastros/produtos" passHref>
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button>Salvar</Button>
             </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
