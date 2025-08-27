
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function ClientLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call for client
    setTimeout(() => {
      router.push('/portal/embarques');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-background">
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
              Portal do Cliente
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
                Acesse seus embarques e documentos.
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
                            placeholder="seu.email@cliente.com"
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

                 <div className="flex items-center justify-end">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
