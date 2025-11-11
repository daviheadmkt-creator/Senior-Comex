
'use client';

import { useEffect, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useFirestore,
  useDoc,
  useMemoFirebase,
  useUser,
  useAuth,
} from '@/firebase';
import { collection, doc, getCountFromServer, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const userRoles = ['Administrador', 'Operador', 'Financeiro', 'Logística'];
const userStatus = ['Ativo', 'Inativo'];

export default function NovoUsuarioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();
  const { user: currentUser } = useUser();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    funcao: '',
    status: 'Ativo',
  });
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = searchParams.has('edit');
  const userId = searchParams.get('id');

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return doc(firestore, 'users', userId);
  }, [firestore, userId]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (userData) {
      setFormData(userData as any);
    }
  }, [userData]);

  const pageTitle = isEditing ? 'Editar Usuário' : 'Novo Usuário';
  const pageDescription = isEditing
    ? 'Altere as informações do usuário selecionado.'
    : 'Adicione um novo usuário ao sistema.';

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !auth) {
        toast({ title: 'Erro', description: 'Serviços de autenticação ou base de dados indisponíveis.', variant: 'destructive'});
        return;
    }

    setIsSaving(true);

    if (isEditing && userId) {
        // --- LOGICA DE EDIÇÃO ---
        const userRef = doc(firestore, 'users', userId);
        try {
            await setDoc(userRef, formData, { merge: true });
            toast({
                title: 'Sucesso!',
                description: 'O usuário foi atualizado.',
            });
            router.push('/dashboard/cadastros/usuarios');
        } catch (error: any) {
            toast({ title: 'Erro ao Atualizar', description: error.message, variant: 'destructive'});
        } finally {
            setIsSaving(false);
        }

    } else {
        // --- LOGICA DE CRIAÇÃO ---
        try {
            // 1. Criar usuário na Autenticação com uma senha temporária
            // A senha é forte o suficiente para os padrões do Firebase, mas não deve ser usada pelo usuário.
            const tempPassword = `Seni0r_${Date.now()}`;
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, tempPassword);
            const user = userCredential.user;
            
            // 2. Criar documento no Firestore
            const usersCollectionRef = collection(firestore, 'users');
            const snapshot = await getCountFromServer(usersCollectionRef);
            const isFirstUser = snapshot.data().count <= 1; // <= 1 porque o usuário já foi criado na auth

            const userRef = doc(firestore, 'users', user.uid);
            const dataToSave = { 
                id: user.uid,
                nome: formData.nome,
                email: formData.email,
                funcao: isFirstUser ? 'Administrador' : (formData.funcao || 'Operador'),
                status: 'Ativo',
            };

            await setDoc(userRef, dataToSave, { merge: true });

            toast({
                title: 'Sucesso!',
                description: `Usuário criado. O próximo passo é enviar um e-mail de redefinição de senha.`,
            });
            
            // Idealmente, aqui você chamaria uma função para enviar o e-mail de redefinição de senha.
            // await sendPasswordResetEmail(auth, formData.email);

            router.push('/dashboard/cadastros/usuarios');

        } catch (error: any) {
            let description = 'Ocorreu um erro ao criar o usuário.';
            if (error.code === 'auth/email-already-in-use') {
                description = 'Este endereço de e-mail já está em uso por outra conta.';
            } else if (error.code === 'auth/invalid-email') {
                description = 'O e-mail fornecido não é válido.';
            }
            toast({ title: 'Erro na Criação', description, variant: 'destructive'});
        } finally {
            setIsSaving(false);
        }
    }
  };
  
  if (isUserLoading) {
      return (
          <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      );
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/cadastros/usuarios" passHref>
              <Button variant="outline" size="icon" type="button">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <CardTitle>{pageTitle}</CardTitle>
              <CardDescription>{pageDescription}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Insira o nome completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@senior.com"
                required
                disabled={isEditing}
              />
               {isEditing && <p className='text-xs text-muted-foreground'>O e-mail não pode ser alterado após a criação.</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="funcao">Função / Cargo</Label>
                <Select
                  value={formData.funcao}
                  onValueChange={(value) => handleInputChange('funcao', value)}
                  required
                >
                  <SelectTrigger id="funcao">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {userStatus.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!isEditing && (
                 <p className='text-sm text-muted-foreground p-4 border rounded-md'>
                    Um novo usuário será criado no sistema de autenticação. Após a criação, recomendamos enviar um e-mail de redefinição de senha para que o usuário possa definir sua própria senha de acesso.
                </p>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Link href="/dashboard/cadastros/usuarios" passHref>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? (isEditing ? 'Salvando...' : 'Criando...') : (isEditing ? 'Salvar Alterações' : 'Criar Usuário')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
