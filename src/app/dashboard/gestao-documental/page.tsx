
'use client';

import { useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { UploadCloud, FileCheck, FileX } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const embarques = [
  { id: 1, referencia: 'SEN2378-25' },
  { id: 2, referencia: 'SEN2378-26' },
  { id: 3, referencia: 'SEN2378-27' },
  { id: 4, referencia: 'SEN2378-28' },
];

const checklistItems = [
    { id: 'due', label: 'DUE Averbada' },
    { id: 'bl', label: 'BL (Bill of Lading) Anexado' },
    { id: 'invoice', label: 'Commercial Invoice Anexada' },
    { id: 'packing', label: 'Packing List Anexado' },
    { id: 'lpco', label: 'LPCO Liberado' },
]

export default function GestaoDocumentalPage() {
    const [selectedEmbarque, setSelectedEmbarque] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestão Documental</CardTitle>
          <CardDescription>
            Controle e anexe todos os documentos dos seus embarques.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="embarque-referencia">
                Selecione o Embarque
              </Label>
              <Select onValueChange={(value) => setSelectedEmbarque(value)}>
                <SelectTrigger id="embarque-referencia">
                  <SelectValue placeholder="Selecione uma referência..." />
                </SelectTrigger>
                <SelectContent>
                  {embarques.map((embarque) => (
                    <SelectItem key={embarque.id} value={String(embarque.id)}>
                      {embarque.referencia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedEmbarque && (
        <div className='grid lg:grid-cols-2 gap-6'>
        <Card>
            <CardHeader>
                <CardTitle>Controle de Documentos</CardTitle>
                 <CardDescription>
                    Gerencie os status e os números dos documentos obrigatórios.
                </CardDescription>
            </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="lpco-numero">Número LPCO</Label>
                <Input id="lpco-numero" placeholder="Insira o número do LPCO" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lpco-status">Status LPCO</Label>
                <Select>
                    <SelectTrigger id="lpco-status">
                        <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="liberado">Liberado</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                         <SelectItem value="em_analise">Em Análise</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
             <div className="grid md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="due-numero">Número DUE</Label>
                <Input id="due-numero" placeholder="Insira o número da DUE" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-status">Status DUE</Label>
                <Select>
                    <SelectTrigger id="due-status">
                        <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="averbada">Averbada</SelectItem>
                        <SelectItem value="em_analise">Em Análise</SelectItem>
                        <SelectItem value="nao_iniciada">Não Iniciada</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label>Upload de Documentos</Label>
                    <div className='grid md:grid-cols-3 gap-4'>
                        <Button variant="outline"><UploadCloud className="mr-2 h-4 w-4" /> BL / B/L</Button>
                        <Button variant="outline"><UploadCloud className="mr-2 h-4 w-4" /> Invoice</Button>
                        <Button variant="outline"><UploadCloud className="mr-2 h-4 w-4" /> Packing List</Button>
                    </div>
                </div>
            </div>
             <div className="flex justify-end pt-4">
                  <Button>Salvar Alterações</Button>
             </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Checklist do Embarque</CardTitle>
                <CardDescription>
                    Verifique os documentos obrigatórios para este embarque.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    {checklistItems.map(item => (
                        <div key={item.id} className="flex items-center space-x-3">
                            <Checkbox id={item.id} />
                            <Label htmlFor={item.id} className="font-normal text-sm">{item.label}</Label>
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>
        </div>
      )}
    </div>
  );
}
