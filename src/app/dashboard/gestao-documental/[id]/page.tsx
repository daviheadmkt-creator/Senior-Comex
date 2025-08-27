
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
import { UploadCloud, ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

const checklistItems = [
    { id: 'due', label: 'DUE Averbada' },
    { id: 'bl', label: 'BL (Bill of Lading) Anexado' },
    { id: 'invoice', label: 'Commercial Invoice Anexada' },
    { id: 'packing', label: 'Packing List Anexado' },
    { id: 'lpco', label: 'LPCO Liberado' },
]

export default function GestaoDocumentalDetalhesPage({ params }: { params: { id: string } }) {

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Link href="/dashboard/gestao-documental" passHref>
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Gerenciar Documentos - SEN2378-25
                </h1>
                <p className="text-muted-foreground">
                    Controle e anexe todos os documentos do embarque.
                </p>
            </div>
        </div>


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
                <Input id="lpco-numero" placeholder="Insira o número do LPCO" defaultValue="LPCO24000123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lpco-status">Status LPCO</Label>
                <Select defaultValue="liberado">
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
                <Input id="due-numero" placeholder="Insira o número da DUE" defaultValue="24BR0001234567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-status">Status DUE</Label>
                <Select defaultValue="averbada">
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
                            <Checkbox id={item.id} defaultChecked />
                            <Label htmlFor={item.id} className="font-normal text-sm">{item.label}</Label>
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>
        </div>
    </div>
  );
}
