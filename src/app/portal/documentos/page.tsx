
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DownloadCloud, UploadCloud } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const documents = [
  {
    referencia: 'SEN2378-25',
    docs: [
        { name: 'Commercial Invoice', file: 'INV_SEN2378-25.pdf' },
        { name: 'Bill of Lading (BL)', file: 'BL_SEN2378-25.pdf' },
        { name: 'Packing List', file: 'PL_SEN2378-25.pdf' },
    ]
  },
  {
    referencia: 'SEN2378-26',
    docs: [
         { name: 'Commercial Invoice', file: 'INV_SEN2378-26.pdf' },
         { name: 'Bill of Lading (BL)', file: 'BL_SEN2378-26.pdf' },
    ]
  },
];

const embarques = [
  { id: 1, referencia: 'SEN2378-25' },
  { id: 2, referencia: 'SEN2378-26' },
  { id: 4, referencia: 'SEN2378-28' },
];


export default function ClientDocumentsPage() {
  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Meus Documentos</CardTitle>
            <CardDescription>
              Faça o download dos documentos relacionados aos seus embarques.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm mb-6">
                <Label htmlFor="embarque-select">Selecione um Embarque</Label>
                <Select defaultValue="SEN2378-25">
                    <SelectTrigger id="embarque-select">
                        <SelectValue placeholder="Selecione um embarque" />
                    </SelectTrigger>
                    <SelectContent>
                        {embarques.map((emb) => (
                            <SelectItem key={emb.id} value={emb.referencia}>
                                {emb.referencia}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Documento</TableHead>
                  <TableHead>Arquivo</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.find(d => d.referencia === 'SEN2378-25')?.docs.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.file}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                            <DownloadCloud className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Anexar Documentos</CardTitle>
                <CardDescription>
                    Envie seus documentos para análise da nossa equipe.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid md:grid-cols-2 gap-6 items-end">
                     <div className="space-y-2">
                        <Label htmlFor="doc-type">Tipo de Documento</Label>
                         <Select>
                            <SelectTrigger id="doc-type">
                                <SelectValue placeholder="Selecione o tipo de documento" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nota_fiscal">Nota Fiscal</SelectItem>
                                <SelectItem value="comprovante">Comprovante de Pagamento</SelectItem>
                                <SelectItem value="outros">Outros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file-upload">Selecionar Arquivo</Label>
                        <Input id="file-upload" type="file" />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <Button><UploadCloud className="mr-2 h-4 w-4" />Enviar Documento</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
