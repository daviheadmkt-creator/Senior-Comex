
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
import { PlusCircle, Key, Trash2, Copy, Webhook } from 'lucide-react';

export default function IntegracaoApiPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-md">
              <Webhook className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Integração via API</CardTitle>
              <CardDescription>
                Gerencie suas chaves de API para integrar com outros sistemas.
              </CardDescription>
            </div>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Gerar Nova Chave
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Nome / Descrição</TableHead>
                <TableHead className="w-[40%]">Chave de API</TableHead>
                <TableHead className="w-[15%]">Criada em</TableHead>
                <TableHead className="w-[15%] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Integração ERP</TableCell>
                <TableCell className="font-mono">
                  <div className="flex items-center gap-2">
                    <span>sk_...a1b2</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>15/07/2024</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
