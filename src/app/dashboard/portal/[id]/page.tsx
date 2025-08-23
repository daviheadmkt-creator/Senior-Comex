
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FileText,
  MessageSquare,
  UploadCloud,
  Paperclip,
  Send,
  Download,
  Building,
} from 'lucide-react';
import React from 'react';
import { useParams } from 'next/navigation';

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Em produção':
            return 'bg-yellow-100 text-yellow-800';
        case 'Em trânsito':
            return 'bg-blue-100 text-blue-800';
        case 'Concluído':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

const timelineEvents = [
  {
    status: 'Pedido Recebido',
    date: '10/07/2024',
    description: 'Seu pedido PED-001 foi confirmado e está em nossa fila de produção.',
    isComplete: true,
  },
  {
    status: 'Em Produção',
    date: '12/07/2024',
    description: 'Os itens do seu pedido estão sendo preparados para exportação.',
    isComplete: true,
  },
  {
    status: 'Pronto para Embarque',
    date: '18/07/2024',
    description: 'Sua carga está pronta e aguardando o agendamento com a transportadora.',
    isComplete: true,
  },
  {
    status: 'Embarque Realizado',
    date: '22/07/2024',
    description: 'A carga foi embarcada no navio MSC FANTASIA. BL: MSCU1234567.',
    isComplete: true,
  },
  {
    status: 'Em Trânsito',
    date: '23/07/2024',
    description: 'O navio partiu do Porto de Santos em direção ao destino.',
    isComplete: false,
    isActive: true,
  },
  {
    status: 'Chegada ao Destino',
    date: 'Previsto: 10/08/2024',
    description: 'Previsão de chegada no Porto de Nova York.',
    isComplete: false,
  },
  {
    status: 'Desembaraço Aduaneiro',
    date: 'Aguardando',
    description: 'A documentação será submetida à alfândega local.',
    isComplete: false,
  },
  {
    status: 'Entrega Final',
    date: 'Aguardando',
    description: 'A carga será liberada para o transporte terrestre final.',
    isComplete: false,
  },
];

const documents = [
    { name: 'Commercial Invoice CI-2024-001.pdf', size: '245 KB', date: '20/07/2024'},
    { name: 'Packing List PL-2024-001.pdf', size: '180 KB', date: '20/07/2024'},
    { name: 'Bill of Lading MSCU1234567.pdf', size: '310 KB', date: '22/07/2024'},
]

const messages = [
  { from: 'SeniorComex', text: 'Prezado cliente, sua carga foi embarcada com sucesso. O B/L já está disponível para download.', time: 'Ontem 10:30', isMe: true },
  { from: 'Cliente', text: 'Obrigado pela informação! Previsão de chegada se mantém?', time: 'Ontem 11:15', isMe: false },
]

export default function ClientPortalPage() {
  const params = useParams();
  const id = React.use(params ?? {}).id ?? '';
  const companyName = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {companyName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-3xl">Portal do Cliente</CardTitle>
                    <CardDescription className="flex items-center gap-2 pt-1"><Building className="h-4 w-4" /> {companyName}</CardDescription>
                </div>
            </div>
        </CardHeader>
      </Card>
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Timeline do Processo de Exportação</CardTitle>
                    <CardDescription>Acompanhe cada etapa do seu pedido PED-001</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6">
                         <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
                         <ul className="space-y-8">
                             {timelineEvents.map((event, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${event.isActive ? 'bg-primary ring-4 ring-primary/20' : event.isComplete ? 'bg-primary' : 'bg-border'}`}>
                                        <div className="h-2 w-2 rounded-full bg-white" />
                                    </div>
                                    <div className="flex-1 mt-1">
                                        <h4 className={`font-semibold ${event.isActive ? 'text-primary' : ''}`}>{event.status}</h4>
                                        <p className="text-sm text-muted-foreground">{event.description}</p>
                                        <time className="text-xs text-muted-foreground">{event.date}</time>
                                    </div>
                                </li>
                            ))}
                         </ul>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Documentos do Processo</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Arquivo</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead className="w-[100px] text-center">Ação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map(doc => (
                                    <TableRow key={doc.name}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{doc.date}</TableCell>
                                        <TableCell className="text-center">
                                            <Button variant="outline" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Enviar Novo Documento
                    </Button>
                </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-1 sticky top-6">
            <Card className="flex flex-col h-[calc(100vh-10rem)]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-4">
                     {messages.map((msg, i) => (
                        <div key={i} className={`flex items-end gap-2 ${msg.isMe ? 'justify-end' : ''}`}>
                             {!msg.isMe && <Avatar className="h-8 w-8"><AvatarFallback>C</AvatarFallback></Avatar>}
                            <div className={`max-w-xs rounded-lg p-3 ${msg.isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                            </div>
                              {msg.isMe && <Avatar className="h-8 w-8"><AvatarFallback>S</AvatarFallback></Avatar>}
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="pt-4 border-t">
                     <div className="relative w-full">
                        <Input placeholder="Digite sua mensagem..." className="pr-16" />
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                            <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5 text-muted-foreground" /></Button>
                             <Button size="icon"><Send className="h-5 w-5" /></Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
