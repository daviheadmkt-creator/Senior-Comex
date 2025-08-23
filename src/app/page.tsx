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
                  <svg xmlns="http://www.w3.org/2000/svg" width="250" height="40" viewBox="0 0 250 40">
                    <text x="0" y="30" fontFamily="sans-serif" fontSize="20" fill="currentColor">
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
