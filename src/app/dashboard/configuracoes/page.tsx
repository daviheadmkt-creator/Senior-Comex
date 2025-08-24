
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Bell, Palette, Languages, KeyRound, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Ver perfil</h1>
        <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader className="p-0">
                         <div className="relative h-24 bg-muted">
                            <Image src="https://placehold.co/600x400.png" alt="Cover photo" layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint="abstract texture" />
                         </div>
                         <div className="flex justify-center -mt-12">
                             <Avatar className="h-24 w-24 border-4 border-card">
                                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                <AvatarFallback>OP</AvatarFallback>
                            </Avatar>
                         </div>
                         <div className="text-center p-4 border-b">
                            <h2 className="text-xl font-bold">Jacob Jones</h2>
                            <p className="text-muted-foreground">ifrandom@gmail.com</p>
                         </div>
                    </CardHeader>
                    <CardContent className="py-6 space-y-4">
                        <h3 className="font-semibold text-lg">Informações pessoais</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex">
                                <span className="w-1/3 text-muted-foreground">Nome completo</span>
                                <span className="w-2/3 font-medium">: Will Jonto</span>
                            </div>
                             <div className="flex">
                                <span className="w-1/3 text-muted-foreground">E-mail</span>
                                <span className="w-2/3 font-medium">: willjontoax@gmail.com</span>
                            </div>
                             <div className="flex">
                                <span className="w-1/3 text-muted-foreground">Número de telefone</span>
                                <span className="w-2/3 font-medium">: (1) 2536 2561 2365</span>
                            </div>
                             <div className="flex">
                                <span className="w-1/3 text-muted-foreground">Departamento</span>
                                <span className="w-2/3 font-medium">: Projeto</span>
                            </div>
                             <div className="flex">
                                <span className="w-1/3 text-muted-foreground">Designação</span>
                                <span className="w-2/3 font-medium">: Designer de UI UX</span>
                            </div>
                             <div className="flex">
                                <span className="w-1/3 text-muted-foreground">Idiomas</span>
                                <span className="w-2/3 font-medium">: Inglês</span>
                            </div>
                              <div className="flex">
                                <span className="w-1/3 text-muted-foreground">Biografia</span>
                                <span className="w-2/3 font-medium">: Lorem Ipsum é simplesmente uma simulação de texto usada na indústria tipográfica e de impressos.</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                 <Tabs defaultValue="edit-profile">
                    <TabsList>
                        <TabsTrigger value="edit-profile">Editar perfil</TabsTrigger>
                        <TabsTrigger value="change-password">Alterar a senha</TabsTrigger>
                        <TabsTrigger value="notifications">Configurações de notificação</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit-profile">
                        <Card>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-2">
                                    <Label>Imagem de perfil</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                                <AvatarFallback>OP</AvatarFallback>
                                            </Avatar>
                                            <Button size="icon" className="absolute bottom-0 right-0 h-7 w-7 rounded-full">
                                                <Camera className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Imagem de perfil</p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF até 10MB</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nome-completo">Nome completo*</Label>
                                        <Input id="nome-completo" defaultValue="Will Jonto" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="email">E-mail*</Label>
                                        <Input id="email" type="email" defaultValue="willjontoax@gmail.com" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone">Telefone</Label>
                                        <Input id="telefone" type="tel" defaultValue="(1) 2536 2561 2365" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="departamento">Departamento*</Label>
                                        <Select defaultValue="projeto">
                                            <SelectTrigger id="departamento"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="projeto">Projeto</SelectItem>
                                                <SelectItem value="vendas">Vendas</SelectItem>
                                                <SelectItem value="marketing">Marketing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="designacao">Designação*</Label>
                                         <Select defaultValue="designer">
                                            <SelectTrigger id="designacao"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="designer">Designer de UI UX</SelectItem>
                                                <SelectItem value="developer">Desenvolvedor</SelectItem>
                                                <SelectItem value="manager">Gerente</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="linguagem">Linguagem*</Label>
                                        <Select defaultValue="ingles">
                                            <SelectTrigger id="linguagem"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ingles">Inglês</SelectItem>
                                                <SelectItem value="portugues">Português</SelectItem>
                                                <SelectItem value="espanhol">Espanhol</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="descricao">Descrição</Label>
                                    <Textarea id="descricao" placeholder="Escreva a descrição..." />
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end gap-2">
                                <Button variant="outline">Cancelar</Button>
                                <Button>Salvar</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="change-password">
                        <Card>
                            <CardHeader><CardTitle>Alterar a Senha</CardTitle></CardHeader>
                            <CardContent>
                                <p>Formulário para alterar a senha.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="notifications">
                        <Card>
                             <CardHeader><CardTitle>Configurações de Notificação</CardTitle></CardHeader>
                             <CardContent>
                                <p>Opções para notificações.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                 </Tabs>
            </div>
        </div>
    </div>
  );
}
