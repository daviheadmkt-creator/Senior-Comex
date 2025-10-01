
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
import { ArrowLeft } from 'lucide-react';
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
  setDocumentNonBlocking,
} from '@/firebase';
import { collection, doc, getCountFromServer, setDoc } from 'firebase/firestore';

const userRoles = ['Administrador', 'Operador', 'Financeiro', 'Logística'];
const userStatus = ['Ativo', 'Inativo'];

export default function NovoUsuarioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user: currentUser } = useUser();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    funcao: '',
    status: 'Ativo',
  });

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
    if (!firestore) return;

    let docId = userId;
    let isFirstUser = false;
    
    // Fallback to creating a new ID if for some reason currentUser isn't available
    if(!isEditing && !docId) {
      docId = doc(collection(firestore, 'users')).id;
    }
    
    // The first user created becomes an admin. Use their auth UID if available.
    if (!isEditing && currentUser && !userId) {
        const usersCollectionRef = collection(firestore, 'users');
        const snapshot = await getCountFromServer(usersCollectionRef);
        if (snapshot.data().count === 0) {
            isFirstUser = true;
            docId = currentUser.uid;
        }
    }
    
    if (!docId) {
        toast({ title: 'Erro', description: 'Falha ao obter ID para o usuário.', variant: 'destructive'});
        return;
    }

    const userRef = doc(firestore, 'users', docId);

    const dataToSave = { 
      ...formData,
      id: docId,
      funcao: isFirstUser ? 'Administrador' : (formData.funcao || 'Operador'),
    };
    
    await setDoc(userRef, dataToSave, { merge: true });

    toast({
        title: 'Sucesso!',
        description: `O usuário foi ${isEditing ? 'atualizado' : 'salvo'}. ${isFirstUser ? 'Este usuário foi definido como Administrador.' : ''}`,
    });

    router.push('/dashboard/cadastros/usuarios');
  };

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
              />
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
            <div className="flex justify-end gap-2 pt-4">
              <Link href="/dashboard/cadastros/usuarios" passHref>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
