
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

const logs: any[] = [];

const usuarios: any[] = []

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
