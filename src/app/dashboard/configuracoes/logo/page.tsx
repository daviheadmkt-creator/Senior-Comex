
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { ArrowLeft, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function LogoConfigPage() {
  const { toast } = useToast();
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('system_logo');
    if (savedLogo) {
      setCurrentLogo(savedLogo);
      setPreviewLogo(savedLogo);
    }
  }, []);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "Erro",
          description: "O ficheiro é demasiado grande. Por favor, escolha um ficheiro com menos de 2MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (previewLogo) {
      localStorage.setItem('system_logo', previewLogo);
      setCurrentLogo(previewLogo);
      toast({
        title: "Sucesso!",
        description: "O novo logo foi guardado e será exibido em toda a aplicação.",
      });
      // Optional: force reload to see changes everywhere immediately
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/configuracoes" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Logo do Sistema</h1>
          <p className="text-muted-foreground">
            Personalize a identidade visual do sistema.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Alterar Logo</CardTitle>
          <CardDescription>
            Faça o upload de um novo logo nos formatos PNG, JPG ou SVG. Recomendamos uma imagem horizontal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className='space-y-4'>
                <Label>Pré-visualização do Logo</Label>
                <div className='flex items-center justify-center rounded-lg border border-dashed p-8 h-32 bg-muted/50'>
                    {previewLogo ? (
                        <Image src={previewLogo} alt="Preview Logo" width={240} height={48} className='object-contain max-h-full' />
                    ) : (
                         <div className="text-primary h-10 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" className="h-full w-auto">
                                <path fill="currentColor" d="M20 40C9 40 0 31 0 20S9 0 20 0s20 9 20 20-9 20-20 20zm-4.3-7.7L25 22.6a1.4 1.4 0 000-2.3L15.7 10a1.4 1.4 0 00-2.3 0L3.7 20l9.7 7.7a1.4 1.4 0 002.3 0zM24.3 30L15 22.6a1.4 1.4 0 010-2.3L24.3 10a1.4 1.4 0 012.3 0L36.3 20l-9.7 7.7a1.4 1.4 0 01-2.3 0z"/>
                                <text x="50" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="currentColor">senior</text>
                                <text x="50" y="36" fontFamily="sans-serif" fontSize="9" fill="currentColor">Assessoria em Comércio Exterior Ltda</text>
                            </svg>
                        </div>
                    )}
                </div>
            </div>
            
            <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/svg+xml"
            />
            
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleLogoClick}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Alterar Logo
                </Button>
                <Button onClick={handleSave} disabled={!previewLogo || previewLogo === currentLogo}>
                    Salvar Alterações
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
