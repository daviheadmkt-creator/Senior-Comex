
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
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUser } from '@/ai/flows/create-user-flow';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const userSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório."),
  email: z.string().email("O e-mail é inválido."),
  cargo: z.string().min(1, "O cargo é obrigatório."),
  permissao: z.enum(['Administrador', 'Operador', 'Apenas Leitura']),
});

type UserFormData = z.infer<typeof userSchema>;

export default function NovoUsuarioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nome: '',
      email: '',
      cargo: '',
      permissao: 'Operador',
    },
  });

  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Usuário' : 'Novo Usuário';
  const pageDescription = isEditing
    ? 'Altere as informações do usuário selecionado.'
    : 'Adicione um novo usuário e defina suas permissões.';

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      await createUser(data);
      toast({
        title: "Sucesso!",
        description: "Usuário criado. Um e-mail foi enviado para que ele defina a senha.",
      });
      router.push('/dashboard/dados-referencia/usuarios');
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast({
        title: "Erro ao criar usuário",
        description: "Não foi possível criar o usuário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className='flex items-center gap-4'>
              <Link href="/dashboard/dados-referencia/usuarios" passHref>
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Insira o nome do usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail / Login</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="usuario@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cargo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: COMÉRCIO EXTERIOR" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Permissão</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um nível" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Administrador">Administrador</SelectItem>
                          <SelectItem value="Operador">Operador</SelectItem>
                          <SelectItem value="Apenas Leitura">Apenas Leitura</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Link href="/dashboard/dados-referencia/usuarios" passHref>
                  <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
