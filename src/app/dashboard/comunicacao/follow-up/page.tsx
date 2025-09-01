
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const templates: any[] = [];

const getStatusVariant = (status: string) => {
    return status === 'Ativo' ? 'default' : 'secondary';
};

export default function FollowUpPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow Up Automático</CardTitle>
        <CardDescription>
          Configure e gerencie os e-mails e alertas automáticos enviados aos seus clientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gatilho do Evento</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.gatilho}</TableCell>
                <TableCell>{template.canal}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(template.status)} className={
                        template.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }>
                        {template.status}
                    </Badge>
                </TableCell>
                <TableCell className="flex items-center gap-4">
                    <Switch defaultChecked={template.status === 'Ativo'} />
                    <Link href={`/dashboard/comunicacao/follow-up/editar?id=${template.id}`}>
                        <Button variant="outline" size="sm">
                            Editar Template
                        </Button>
                    </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
