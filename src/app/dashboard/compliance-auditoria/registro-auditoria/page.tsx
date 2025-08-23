
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, History, Eye, FileDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const auditLogs = [
  {
    id: 1,
    timestamp: '22/07/2024 10:30:15',
    user: 'operador@senior.com',
    action: 'Criação de Pedido',
    module: 'Gestão Comercial',
    details: 'Pedido PED-002 criado para o cliente Global Trade Corp.',
    type: 'CREATE',
  },
  {
    id: 2,
    timestamp: '22/07/2024 09:45:00',
    user: 'admin@senior.com',
    action: 'Atualização de Cliente',
    module: 'Cadastros',
    details: 'Limite de crédito do cliente Importadora Exemplo LLC atualizado para $75,000.',
    type: 'UPDATE',
  },
  {
    id: 3,
    timestamp: '21/07/2024 18:00:50',
    user: 'operador@senior.com',
    action: 'Exclusão de Produto',
    module: 'Cadastros',
    details: 'Produto SKU-TEMP-01 foi removido do sistema.',
    type: 'DELETE',
  },
  {
    id: 4,
    timestamp: '21/07/2024 15:20:00',
    user: 'sistema',
    action: 'Validação de Sanções (IA)',
    module: 'Compliance',
    details: 'Verificação de sanções para "Global Trade Corp" retornou "Liberado".',
    type: 'READ',
  },
    {
    id: 5,
    timestamp: '20/07/2024 11:00:23',
    user: 'financeiro@senior.com',
    action: 'Registro de Pagamento',
    module: 'Gestão Financeira',
    details: 'Pagamento da fatura CI-2024-001 de $21,800.00 recebido.',
    type: 'UPDATE',
  },
];

const getTypeClass = (type: string) => {
    switch (type) {
        case 'CREATE':
            return 'bg-blue-100 text-blue-800';
        case 'UPDATE':
            return 'bg-yellow-100 text-yellow-800';
        case 'DELETE':
            return 'bg-red-100 text-red-800';
        case 'READ':
             return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}


export default function RegistroAuditoriaPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-md">
                    <History className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>Registro de Auditoria (Logs)</CardTitle>
                    <CardDescription>
                    Acompanhe o histórico de todas as ações realizadas no sistema.
                    </CardDescription>
                </div>
            </div>
             <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Exportar Relatório
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-4 gap-4 p-4 border rounded-lg">
            <div className="space-y-2 md:col-span-2">
                <Label>Buscar por usuário, ação ou detalhe</Label>
                <Input placeholder="Ex: operador@senior.com, Criação de Pedido, PED-002..." />
            </div>
            <div className="space-y-2">
                <Label>Módulo</Label>
                <Select>
                    <SelectTrigger>
                    <SelectValue placeholder="Todos os Módulos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Módulos</SelectItem>
                        <SelectItem value="cadastros">Cadastros</SelectItem>
                        <SelectItem value="comercial">Gestão Comercial</SelectItem>
                        <SelectItem value="documental">Gestão Documental</SelectItem>
                        <SelectItem value="aduaneira">Gestão Aduaneira</SelectItem>
                        <SelectItem value="logistica">Gestão Logística</SelectItem>
                        <SelectItem value="financeira">Gestão Financeira</SelectItem>
                        <SelectItem value="compliance">Compliance e Auditoria</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Tipo de Ação</Label>
                <Select>
                    <SelectTrigger>
                    <SelectValue placeholder="Todos os Tipos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Tipos</SelectItem>
                        <SelectItem value="create">Criação (CREATE)</SelectItem>
                        <SelectItem value="update">Atualização (UPDATE)</SelectItem>
                        <SelectItem value="delete">Exclusão (DELETE)</SelectItem>
                        <SelectItem value="read">Leitura/Consulta (READ)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[15%]">Data e Hora</TableHead>
                <TableHead className="w-[15%]">Usuário</TableHead>
                <TableHead className="w-[20%]">Ação</TableHead>
                <TableHead className="w-[15%]">Módulo</TableHead>
                <TableHead className="w-[30%]">Detalhes</TableHead>
                <TableHead className="w-[5%] text-center">Tipo</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                        <TableCell className="text-muted-foreground text-xs">{log.timestamp}</TableCell>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.module}</TableCell>
                        <TableCell className="text-muted-foreground">{log.details}</TableCell>
                         <TableCell className="text-center">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge className={getTypeClass(log.type)}>{log.type}</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tipo de Operação: {log.type}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
