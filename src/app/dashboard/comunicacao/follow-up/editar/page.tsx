
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
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditarTemplatePage() {

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
            <Link href="/dashboard/comunicacao/follow-up" passHref>
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Editar Template de E-mail
                </h1>
                <p className="text-muted-foreground">
                    Gatilho: Embarque Confirmado
                </p>
            </div>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo do E-mail</CardTitle>
          <CardDescription>
            Personalize a mensagem que será enviada. Você pode usar variáveis como {'{{cliente_nome}}'} e {'{{ref_embarque}}'}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="space-y-2">
                <Label htmlFor="assunto-email">Assunto do E-mail</Label>
                <Input id="assunto-email" defaultValue="Confirmação de Embarque - Processo {{ref_embarque}}" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="corpo-email">Corpo do E-mail</Label>
                <Textarea 
                    id="corpo-email" 
                    className="min-h-[300px]"
                    defaultValue={`Prezado(a) {{cliente_nome}},

Informamos que seu embarque de referência {{ref_embarque}} foi confirmado com sucesso.

Em breve enviaremos mais detalhes.

Atenciosamente,
Equipe Senior Assessoria.`}
                />
            </div>
             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/comunicacao/follow-up" passHref>
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button>Salvar Template</Button>
             </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
