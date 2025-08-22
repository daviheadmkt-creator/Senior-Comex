"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-sm w-full shadow-2xl">
        <CardHeader className="space-y-2 text-center">
            <div className="w-full flex justify-center pb-2">
                <div className="text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="140" height="40" viewBox="0 0 351.34 77.25">
                    <path d="M42.7,5.55A38.63,38.63,0,0,1,76.5,52.35l-11-3.3a26,26,0,1,0-26,26l3.3,11A38.63,38.63,0,0,1,42.7,5.55Z" fill="currentColor"/>
                    <path d="M37.35,31.12,4.8,42.7a26,26,0,0,0,32.55,11.55l-11-20.8A26,26,0,0,0,37.35,31.12Z" fill="currentColor"/>
                    <path d="M48.1,25.72,27.3,14.17a26,26,0,0,0-14.8,36l22.3-7.55A26,26,0,0,0,48.1,25.72Z" fill="currentColor"/>
                    <text x="85" y="60" fontFamily="sans-serif" fontSize="60" fill="currentColor">
                      senior
                    </text>
                    <text x="135" y="75" fontFamily="sans-serif" fontSize="14" fill="currentColor">
                      Assessoria em Comércio Exterior Ltda
                    </text>
                  </svg>
                </div>
            </div>
          <CardTitle className="text-2xl font-bold font-headline">Bem-vindo</CardTitle>
          <CardDescription>Insira suas credenciais para acessar seu painel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@exemplo.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="ml-auto inline-block text-sm text-primary/80 hover:text-primary hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
