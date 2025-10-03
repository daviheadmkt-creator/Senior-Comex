
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import Image from 'next/image';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getCountFromServer, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast({
            title: 'Erro',
            description: 'As palavras-passe não coincidem.',
            variant: 'destructive',
        });
        return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if this is the first user
      const usersCollectionRef = collection(firestore, 'users');
      const snapshot = await getCountFromServer(usersCollectionRef);
      const isFirstUser = snapshot.data().count === 0;

      // Create user document in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        id: user.uid,
        nome: name,
        email: user.email,
        funcao: isFirstUser ? 'Administrador' : 'Operador',
        status: 'Ativo',
      });

      toast({
          title: 'Sucesso!',
          description: `Conta criada com sucesso. ${isFirstUser ? 'Você é o primeiro administrador!' : 'A sua função é Operador.'}`,
      });

      router.push('/dashboard');
    } catch (error: any) {
        let description = 'Ocorreu um erro ao criar a sua conta.';
        if (error.code === 'auth/email-already-in-use') {
            description = 'Este endereço de e-mail já está a ser utilizado.';
        } else if (error.code === 'auth/weak-password') {
            description = 'A sua palavra-passe é demasiado fraca. Por favor, escolha uma mais forte.';
        }
        toast({
            title: 'Erro de Registo',
            description: description,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
             <div className="text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="200" height="40" viewBox="0 0 200 40">
                <path fill="currentColor" d="M20 40C9 40 0 31 0 20S9 0 20 0s20 9 20 20-9 20-20 20zm-4.3-7.7L25 22.6a1.4 1.4 0 000-2.3L15.7 10a1.4 1.4 0 00-2.3 0L3.7 20l9.7 7.7a1.4 1.4 0 002.3 0zM24.3 30L15 22.6a1.4 1.4 0 010-2.3L24.3 10a1.4 1.4 0 012.3 0L36.3 20l-9.7 7.7a1.4 1.4 0 01-2.3 0z"/>
                <text x="50" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="currentColor">senior</text>
                <text x="50" y="36" fontFamily="sans-serif" fontSize="9" fill="currentColor">Assessoria em Comércio Exterior Ltda</text>
              </svg>
            </div>
            <h2 className="mt-8 text-3xl font-extrabold text-foreground">
              Criar nova conta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Junte-se à plataforma para gerir as suas exportações.
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <User className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="O seu nome completo"
                            required
                            className="pl-10"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="nome@email.com"
                            required
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="password">Palavra-passe</Label>
                    <div className="relative mt-1">
                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            className="pl-10"
                            placeholder='Mínimo 6 caracteres'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                         <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                                {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                           </button>
                        </div>
                    </div>
                </div>
                 <div>
                    <Label htmlFor="confirmPassword">Confirmar Palavra-passe</Label>
                    <div className="relative mt-1">
                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            className="pl-10"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                         <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                           <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="focus:outline-none">
                                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                           </button>
                        </div>
                    </div>
                </div>


                <div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Conta
                  </Button>
                </div>
              </form>

                 <div className="mt-8 text-center text-sm">
                    <p className="text-muted-foreground">
                        Já tem uma conta?{' '}
                        <Link href="/" className="font-medium text-primary hover:text-primary/80">
                            Aceda aqui
                        </Link>
                    </p>
                 </div>
            </div>
          </div>
        </div>
      </div>
       <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="https://img.freepik.com/fotos-gratis/trabalhadores-verificando-o-estoque-de-carga-no-patio-de-conteineres_335224-1378.jpg?w=1060"
          alt="Container yard"
          data-ai-hint="logistics team"
          width={1060}
          height={1200}
        />
      </div>
    </div>
  );
}
