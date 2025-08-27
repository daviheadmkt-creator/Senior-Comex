
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.16c1.63 0 3.06.56 4.19 1.62l3.14-3.14C17.45 1.99 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      <path fill="none" d="M1 1h22v22H1z"/>
    </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
             <div className="text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="200" height="40" viewBox="0 0 200 40">
                <path fill="currentColor" d="M20 40C9 40 0 31 0 20S9 0 20 0s20 9 20 20-9 20-20-20zm-4.3-7.7L25 22.6a1.4 1.4 0 000-2.3L15.7 10a1.4 1.4 0 00-2.3 0L3.7 20l9.7 7.7a1.4 1.4 0 002.3 0zM24.3 30L15 22.6a1.4 1.4 0 010-2.3L24.3 10a1.4 1.4 0 012.3 0L36.3 20l-9.7 7.7a1.4 1.4 0 01-2.3 0z"/>
                <text x="50" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="currentColor">senior</text>
                <text x="50" y="36" fontFamily="sans-serif" fontSize="9" fill="currentColor">Assessoria em Comércio Exterior Ltda</text>
              </svg>
            </div>
            <h2 className="mt-8 text-3xl font-extrabold text-foreground">
              Acesse sua Conta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Bem-vindo de volta! Por favor, insira seus dados.
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleLogin} className="space-y-6">
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
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative mt-1">
                         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            className="pl-10"
                            defaultValue="password"
                        />
                         <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                                {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                           </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox id="remember-me" name="remember-me" />
                    <Label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                      Lembrar de mim
                    </Label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:text-primary/80">
                      Esqueceu a senha?
                    </a>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-2 text-muted-foreground">Ou entre com</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div>
                    <Button variant="outline" className="w-full">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" className="mr-2"><path d="M12 2.04c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zm2.25 10.5h-2v6h-3v-6h-1.5v-3h1.5v-2.25c0-1.25.75-2.75 2.75-2.75h2.5v3h-1.5c-.25 0-.5.25-.5.5v1.5h2l-.25 3z"></path></svg>
                      Facebook
                    </Button>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full">
                       <GoogleIcon />
                      <span className="ml-2">Google</span>
                    </Button>
                  </div>
                </div>
                 <div className="mt-8 text-center text-sm">
                    <p className="text-muted-foreground">
                        É um cliente?{' '}
                        <Link href="/portal/login" className="font-medium text-primary hover:text-primary/80">
                            Acesse o portal aqui
                        </Link>
                    </p>
                    <p className="mt-4 text-muted-foreground">
                        Não tem uma conta?{' '}
                        <a href="#" className="font-medium text-primary hover:text-primary/80">
                            Cadastre-se
                        </a>
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="https://img.freepik.com/fotos-gratis/vista-aerea-do-navio-de-carga-e-do-conteiner-de-carga-no-porto_335224-1380.jpg?t=st=1755996289~exp=1755999889~hmac=9a7138dbde97973314eda533384e04570bf38a33a300f5ac47a695bf15eb4bdf&w=1060"
          alt="Port with shipping containers"
          data-ai-hint="port logistics"
          width={1060}
          height={1200}
        />
      </div>
    </div>
  );
}
