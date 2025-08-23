
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Upload,
  Send,
  Paperclip,
  Smile,
  MessageSquare,
  CheckCircle,
  Truck,
  Ship,
  Plane,
  Warehouse,
  FileCheck2,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

const timelineEvents = [
  {
    status: 'Pedido Recebido',
    date: '10/07/2024',
    description: 'Pedido PED-001 confirmado e em processamento.',
    icon: CheckCircle,
    isComplete: true,
  },
  {
    status: 'Produção Finalizada',
    date: '18/07/2024',
    description: 'Mercadoria pronta para coleta.',
    icon: Warehouse,
    isComplete: true,
  },
  {
    status: 'Coleta pela Transportadora',
    date: '20/07/2024',
    description: 'Carga coletada e a caminho do porto.',
    icon: Truck,
    isComplete: true,
  },
  {
    status: 'Chegada ao Porto',
    date: '22/07/2024',
    description: 'Carga entregue no Porto de Santos.',
    icon: Ship,
    isComplete: true,
  },
  {
    status: 'Embarque',
    date: '25/07/2024',
    description: 'Carga embarcada no navio MSC Fantasia.',
    icon: Plane,
    isComplete: false,
  },
  {
    status: 'Desembaraço Aduaneiro',
    date: 'Previsto: 08/08/2024',
    description: 'Aguardando liberação em Port of New York.',
    icon: FileCheck2,
    isComplete: false,
  },
];

const documents = [
  { name: 'Commercial Invoice CI-2024-001.pdf', date: '15/07/2024', size: '256 KB' },
  { name: 'Packing List PL-2024-001.pdf', date: '20/07/2024', size: '180 KB' },
  { name: 'Bill of Lading MSC123456.pdf', date: '25/07/2024', size: '450 KB' },
];

export default function ClientePortalPage({ params }: { params: { id: string } }) {
  // You can fetch client-specific data using params.id
  const clientName = decodeURIComponent(params.id).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Portal do Cliente: {clientName}</CardTitle>
            <CardDescription>Acompanhe em tempo real o andamento do seu processo de exportação.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
                <ul className="space-y-8">
                    {timelineEvents.map((event, index) => (
                        <li key={index} className="flex items-start gap-4">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${event.isComplete ? 'bg-primary' : 'bg-muted-foreground/20'}`}>
                            <event.icon className={`h-5 w-5 ${event.isComplete ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 mt-1">
                            <h4 className="font-semibold">{event.status}</h4>
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
            <div className="space-y-4">
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Nome do Arquivo</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Tamanho</TableHead>
                            <TableHead className="w-[10%]"></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {documents.map((doc, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    {doc.name}
                                </TableCell>
                                <TableCell>{doc.date}</TableCell>
                                <TableCell>{doc.size}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">Ver</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
                 <div className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Arraste e solte arquivos aqui ou</p>
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Carregar Documentos
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-6">
            <CardHeader className="bg-muted/50 flex flex-row items-center gap-3">
                 <MessageSquare className="h-6 w-6 text-primary" />
                 <div>
                    <CardTitle>Chat de Atendimento</CardTitle>
                    <CardDescription>Converse com nosso time.</CardDescription>
                 </div>
            </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(100vh-14rem)]">
            <div className="flex-1 space-y-4 p-4 overflow-y-auto">
                <div className="flex items-end gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>OP</AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs rounded-lg p-3 bg-muted text-sm">
                        <p>Olá! Bem-vindo ao portal de acompanhamento. Seu processo PED-001 está a caminho do porto.</p>
                        <p className="text-xs text-muted-foreground mt-1 text-right">10:32</p>
                    </div>
                </div>
                 <div className="flex items-end gap-2 justify-end">
                    <div className="max-w-xs rounded-lg p-3 bg-primary text-primary-foreground text-sm">
                        <p>Ótimo, obrigado pela atualização!</p>
                        <p className="text-xs text-primary-foreground/70 mt-1 text-right">10:35</p>
                    </div>
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <div className="p-3 border-t bg-background">
                <div className="relative">
                    <Textarea placeholder="Digite sua mensagem aqui..." className="pr-20" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                         <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><Smile className="h-4 w-4" /></Button>
                         <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><Paperclip className="h-4 w-4" /></Button>
                         <Button size="icon" className="rounded-full h-8 w-8"><Send className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
