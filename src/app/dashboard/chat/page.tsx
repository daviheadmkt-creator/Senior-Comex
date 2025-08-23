
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MoreHorizontal,
  Phone,
  Video,
  Paperclip,
  Smile,
  Send,
  Pencil,
  Home,
  AtSign,
  Star,
  Users,
  MessageSquare,
  Plus,
  ArrowDown,
  UserPlus,
  Link,
  ClipboardCheck,
  Languages,
  BarChart3,
  ListTodo,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const messages = [
   {
    id: 1,
    isMe: true,
    text: 'Ola',
    time: 'Agora',
  },
  {
    id: 2,
    isMe: true,
    text: 'tudi bem?',
    time: 'Agora',
  },
];


export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] bg-card border rounded-lg">
      {/* Left Sidebar */}
      <div className="w-[280px] border-r flex flex-col p-3 gap-4">
        <Button size="lg" className="justify-start gap-3 rounded-xl h-12">
            <Pencil className="h-5 w-5" />
            Novo chat
        </Button>
        <div className="flex-1 space-y-4">
            <div className="space-y-1">
                <h3 className="text-xs font-semibold text-muted-foreground px-2">Atalhos</h3>
                <nav className="space-y-1">
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                        <Home className="h-5 w-5 text-muted-foreground" />
                        <span>Início</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                        <AtSign className="h-5 w-5 text-muted-foreground" />
                        <span>Menções</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <span>Com estrela</span>
                    </a>
                </nav>
            </div>
            <div className="space-y-1">
                <h3 className="text-xs font-semibold text-muted-foreground px-2">Espaços</h3>
                <nav className="space-y-1">
                     <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
                        <Avatar className="h-6 w-6 text-xs">
                            <AvatarFallback className="bg-blue-200 text-blue-800">C</AvatarFallback>
                        </Avatar>
                        <span>Comercial</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                        <Avatar className="h-6 w-6 text-xs">
                            <AvatarFallback className="bg-red-200 text-red-800">F</AvatarFallback>
                        </Avatar>
                        <span>Financeiro</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                        <span>Procurar espaços</span>
                    </a>
                </nav>
            </div>
        </div>
        <div className="text-center text-xs text-muted-foreground">
            <p>Ainda não há apps</p>
            <Button variant="link" size="sm" className="h-auto p-0">Conheça os apps</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Tabs defaultValue="chat">
            <CardHeader className="flex flex-row items-center justify-between border-b p-3">
                 <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-200 text-blue-800">C</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-semibold text-lg">Comercial</h2>
                        <p className="text-xs text-muted-foreground">1 participante</p>
                    </div>
                </div>
                <TabsList>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="shared">Compartilhados</TabsTrigger>
                    <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                </TabsList>
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><ListTodo className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
                </div>
            </CardHeader>

            <TabsContent value="chat" className="flex-1 flex flex-col justify-between p-4 bg-muted/20">
                <div className="space-y-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                        <Switch id="history-switch" defaultChecked />
                        <Label htmlFor="history-switch">Histórico ativado</Label>
                    </div>
                     <div className="flex flex-col items-center justify-center">
                        <Image src="https://placehold.co/200x150.png" alt="Welcome Illustration" width={200} height={150} data-ai-hint="collaboration team" />
                        <Button size="sm" className="rounded-full -mt-4">
                            <ArrowDown className="mr-2 h-4 w-4" />
                            Ir para o fim
                        </Button>
                     </div>
                     <div>
                        <p className="font-bold">Davi, este é seu novo espaço de colaboração! Vamos começar:</p>
                        <div className="flex justify-center gap-2 mt-2">
                            <Button variant="outline" size="sm"><UserPlus className="mr-2 h-4 w-4" /> Adicionar partici...</Button>
                            <Button variant="outline" size="sm"><Link className="mr-2 h-4 w-4" /> Compartilhar um ...</Button>
                            <Button variant="outline" size="sm"><ClipboardCheck className="mr-2 h-4 w-4" /> Atribuir ta...</Button>
                        </div>
                     </div>
                      <Card className="text-left">
                        <CardHeader className="p-2">
                            <h3 className="text-sm font-semibold">Apps sugeridos para melhorar seu espaço</h3>
                        </CardHeader>
                        <CardContent className="flex justify-around p-2">
                            <div className="text-center">
                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl"><Languages /></Button>
                                <p className="text-xs mt-1">Abang Translator</p>
                            </div>
                             <div className="text-center">
                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl"><Smile /></Button>
                                <p className="text-xs mt-1">Able Poll</p>
                            </div>
                              <div className="text-center">
                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl"><BarChart3 /></Button>
                                <p className="text-xs mt-1">Absolute Poll</p>
                            </div>
                             <div className="text-center">
                                <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl"><MoreHorizontal /></Button>
                            </div>
                        </CardContent>
                    </Card>
                    <p className="text-xs text-muted-foreground">Você criou este espaço hoje</p>
                </div>
                 <div className="flex-1 overflow-y-auto space-y-4 mt-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-3 ${msg.isMe ? 'justify-end' : ''}`}>
                            <div className={`max-w-md rounded-lg p-3 ${msg.isMe ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
        <div className="p-3 border-t bg-card">
            <div className="relative">
                <Input placeholder="O histórico está ativado" className="rounded-full bg-muted pr-24 pl-10 h-12" />
                 <div className="absolute left-3 top-1/2 -translate-y-1/2">
                     <Button variant="ghost" size="icon" className="rounded-full"><Plus className="text-muted-foreground" /></Button>
                 </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full"><Smile className="text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full"><Paperclip className="text-muted-foreground" /></Button>
                    <Button size="icon" className="rounded-full"><Send /></Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
