
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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const logs = [
  {
    id: 1,
    timestamp: '20/07/2024 10:30:15',
    user: 'Ana Silva',
    action: 'Criação de Embarque',
    details: 'Referência SEN2378-28 criada para o cliente Produtores Associados.',
  },
  {
    id: 2,
    timestamp: '20/07/2024 09:15:45',
    user: 'Carlos Dias',
    action: 'Edição de Cliente',
    details: 'Status do cliente Fazenda Sol Nascente alterado para "Inativo".',
  },
  {
    id: 3,
    timestamp: '19/07/2024 17:55:02',
    user: 'Sistema',
    action: 'Alerta de Deadline',
    details: 'Alerta enviado para o embarque SEN2378-26 (Deadline Draft).',
  },
  {
    id: 4,
    timestamp: '19/07/2024 14:20:11',
    user: 'Daniela Lima',
    action: 'Upload de Documento',
    details: 'Documento "BL_SEN2378-25.pdf" anexado ao embarque SEN2378-25.',
  },
  {
    id: 5,
    timestamp: '18/07/2024 11:05:33',
    user: 'Ana Silva',
    action: 'Login no Sistema',
    details: 'Usuário logado com sucesso.',
  },
];

const usuarios = [
  { id: 1, nome: 'Ana Silva' },
  { id: 2, nome: 'Carlos Dias' },
  { id: 3, nome: 'Daniela Lima' },
  { id: 4, nome: 'Sistema' },
]

export default function LogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/configuracoes" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatório de Log</h1>
          <p className="text-muted-foreground">
            Visualize o histórico de atividades e alterações no sistema.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Atividades</CardTitle>
          <CardDescription>
            Filtre e busque por logs específicos do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6 border p-4 rounded-lg">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <DatePicker />
            </div>
            <div className="space-y-2">
              <Label>Data Final</Label>
              <DatePicker />
            </div>
             <div className="space-y-2">
              <Label htmlFor="usuario-filter">Usuário</Label>
              <Select>
                <SelectTrigger id="usuario-filter">
                  <SelectValue placeholder="Todos os usuários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os usuários</SelectItem>
                  {usuarios.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>{u.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className='flex items-end'>
                <Button className='w-full'>Filtrar</Button>
             </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
