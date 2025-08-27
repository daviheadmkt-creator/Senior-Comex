
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
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const exportHistory = [
    {id: 'EXP-001', date: '20/07/2024', product: 'Soja em Grãos', value: '50.000,00', destination: 'China'},
    {id: 'EXP-002', date: '15/06/2024', product: 'Milho', value: '35.000,00', destination: 'Japão'},
    {id: 'EXP-003', date: '01/05/2024', product: 'Algodão', value: '75.000,00', destination: 'Vietnã'},
]

export default function NovoClientePage() {
  const searchParams = useSearchParams();
  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Cadastro' : 'Novo Cadastro';
  const pageDescription = isEditing
    ? 'Altere as informações do cadastro selecionado.'
    : 'Adicione um novo cliente, fornecedor ou parceiro à sua base de dados.';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className='flex items-center gap-4'>
                <Link href="/dashboard/cadastros/clientes" passHref>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                <CardTitle>{pageTitle}</CardTitle>
                <CardDescription>
                    {pageDescription}
                </CardDescription>
                </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="tipo-cadastro">Tipo de Cadastro</Label>
                    <Select defaultValue={isEditing ? 'cliente-nacional' : undefined}>
                        <SelectTrigger id="tipo-cadastro">
                            <SelectValue placeholder="Selecione o tipo de cadastro" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="agente">Agente</SelectItem>
                            <SelectItem value="controlador">Controlador</SelectItem>
                            <SelectItem value="terminal">Terminal</SelectItem>
                            <SelectItem value="fornecedor">Fornecedor</SelectItem>
                            <SelectItem value="transportadora">Transportadora</SelectItem>
                            <SelectItem value="cliente-nacional">Cliente Nacional</SelectItem>
                            <SelectItem value="cliente-internacional">Cliente Internacional</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="razao-social">Razão Social</Label>
                <Input id="razao-social" placeholder="Insira a razão social" defaultValue={isEditing ? 'Agrícola Exemplo LTDA' : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome-fantasia">Nome Fantasia</Label>
                <Input id="nome-fantasia" placeholder="Insira o nome fantasia" defaultValue={isEditing ? 'Agrícola Exemplo' : ''}/>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ / CPF / ID Fiscal</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" defaultValue={isEditing ? '12.345.678/0001-99' : ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscricao-estadual">Inscrição Estadual / Registro</Label>
                <Input id="inscricao-estadual" placeholder="Insira a inscrição estadual ou registro" />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" placeholder="Rua, número, bairro..." />
            </div>
             <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input id="cidade" placeholder="Insira a cidade" />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input id="estado" placeholder="Insira o estado" />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" placeholder="00000-000" />
                  </div>
             </div>
             
             <Separator />

            <div>
                <h3 className="text-lg font-medium mb-4">Contatos</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="comercial-nome">Comercial - Nome</Label>
                            <Input id="comercial-nome" placeholder="Nome do contato comercial" defaultValue={isEditing ? 'João da Silva' : ''} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="comercial-email">Comercial - E-mail</Label>
                            <Input id="comercial-email" type="email" placeholder="email@cliente.com" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="comercial-telefone">Comercial - Telefone</Label>
                            <Input id="comercial-telefone" placeholder="(00) 00000-0000" />
                        </div>
                    </div>
                     <div className="grid gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="logistica-nome">Logística - Nome</Label>
                            <Input id="logistica-nome" placeholder="Nome do contato de logística" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="logistica-email">Logística - E-mail</Label>
                            <Input id="logistica-email" type="email" placeholder="email@cliente.com" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="logistica-telefone">Logística - Telefone</Label>
                            <Input id="logistica-telefone" placeholder="(00) 00000-0000" />
                        </div>
                    </div>
                </div>
            </div>

             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/cadastros/clientes" passHref>
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button>Salvar</Button>
             </div>
          </form>
        </CardContent>
      </Card>

      {isEditing && (
        <Card>
            <CardHeader>
                <CardTitle>Histórico de Exportações</CardTitle>
                <CardDescription>Lista das últimas exportações realizadas para este cliente.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Produto</TableHead>
                            <TableHead>Valor (USD)</TableHead>
                            <TableHead>Destino</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exportHistory.map((exp) => (
                            <TableRow key={exp.id}>
                                <TableCell className="font-medium">{exp.id}</TableCell>
                                <TableCell>{exp.date}</TableCell>
                                <TableCell>{exp.product}</TableCell>
                                <TableCell>{exp.value}</TableCell>
                                <TableCell>{exp.destination}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
