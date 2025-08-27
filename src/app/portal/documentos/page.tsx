
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
import { DownloadCloud } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <Card>
      <CardHeader>
        <CardTitle>Meus Documentos</CardTitle>
        <CardDescription>
          Faça o download dos documentos relacionados aos seus embarques.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-w-sm mb-6">
             <Select defaultValue="SEN2378-25">
                <SelectTrigger>
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
  );
}
