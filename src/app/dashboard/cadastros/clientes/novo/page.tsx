
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
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const exportHistory = [
    {id: 'EXP-001', date: '20/07/2024', product: 'Soja em Grãos', value: '50.000,00', destination: 'China'},
    {id: 'EXP-002', date: '15/06/2024', product: 'Milho', value: '35.000,00', destination: 'Japão'},
    {id: 'EXP-003', date: '01/05/2024', product: 'Algodão', value: '75.000,00', destination: 'Vietnã'},
]

export default function NovoClientePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
      razao_social: '',
      nome_fantasia: '',
      cnpj: '',
      inscricao_estadual: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      comercial_nome: '',
      comercial_email: '',
      comercial_telefone: '',
      logistica_nome: '',
      logistica_email: '',
      logistica_telefone: '',
  });
  const [isLoadingCnpj, setIsLoadingCnpj] = useState(false);

  const isEditing = searchParams.has('edit');
  const pageTitle = isEditing ? 'Editar Cadastro' : 'Novo Cadastro';
  const pageDescription = isEditing
    ? 'Altere as informações do cadastro selecionado.'
    : 'Adicione um novo cliente, fornecedor ou parceiro à sua base de dados.';
    
  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleCnpjBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cnpj = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (cnpj.length !== 14) {
        return;
    }
    
    setIsLoadingCnpj(true);
    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        if (!response.ok) {
            throw new Error('CNPJ não encontrado ou inválido.');
        }
        const data = await response.json();

        setFormData(prev => ({
            ...prev,
            razao_social: data.razao_social || '',
            nome_fantasia: data.nome_fantasia || '',
            endereco: `${data.logradouro || ''}, ${data.numero || ''} - ${data.bairro || ''}`,
            cidade: data.municipio || '',
            estado: data.uf || '',
            cep: data.cep || '',
        }));

        toast({
            title: "Sucesso!",
            description: "Dados do CNPJ carregados.",
            variant: "default",
        })

    } catch (error: any) {
        console.error("Erro ao buscar CNPJ:", error);
         toast({
            title: "Erro",
            description: error.message || "Não foi possível buscar os dados do CNPJ.",
            variant: "destructive",
        })
    } finally {
        setIsLoadingCnpj(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const newId = storedClients.length > 0 ? Math.max(...storedClients.map((c: any) => c.id)) + 1 : 1;

    const newClient = {
      id: newId,
      nomeEmpresa: formData.nome_fantasia || formData.razao_social,
      cnpj: formData.cnpj,
      contatoPrincipal: formData.comercial_nome,
      status: 'Ativo',
    };

    const updatedClients = [...storedClients, newClient];
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    
    toast({
        title: "Sucesso!",
        description: "O cliente foi salvo.",
        variant: "default",
    });

    router.push('/dashboard/cadastros/clientes');
  };


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
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="razao_social">Razão Social</Label>
                <Input id="razao_social" placeholder="Insira a razão social" value={formData.razao_social} onChange={e => handleInputChange('razao_social', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                <Input id="nome_fantasia" placeholder="Insira o nome fantasia" value={formData.nome_fantasia} onChange={e => handleInputChange('nome_fantasia', e.target.value)} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <Label htmlFor="cnpj">CNPJ / CPF / ID Fiscal</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={e => handleInputChange('cnpj', e.target.value)} onBlur={handleCnpjBlur} />
                 {isLoadingCnpj && <Loader2 className="absolute right-3 top-9 h-5 w-5 animate-spin text-muted-foreground" />}
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscricao_estadual">Inscrição Estadual / Registro</Label>
                <Input id="inscricao_estadual" placeholder="Insira a inscrição estadual ou registro" value={formData.inscricao_estadual} onChange={e => handleInputChange('inscricao_estadual', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" placeholder="Rua, número, bairro..." value={formData.endereco} onChange={e => handleInputChange('endereco', e.target.value)} />
            </div>
             <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input id="cidade" placeholder="Insira a cidade" value={formData.cidade} onChange={e => handleInputChange('cidade', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input id="estado" placeholder="Insira o estado" value={formData.estado} onChange={e => handleInputChange('estado', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" placeholder="00000-000" value={formData.cep} onChange={e => handleInputChange('cep', e.target.value)} />
                  </div>
             </div>
             
             <Separator />

            <div>
                <h3 className="text-lg font-medium mb-4">Contatos</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="comercial_nome">Comercial - Nome</Label>
                            <Input id="comercial_nome" placeholder="Nome do contato comercial" value={formData.comercial_nome} onChange={e => handleInputChange('comercial_nome', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="comercial_email">Comercial - E-mail</Label>
                            <Input id="comercial_email" type="email" placeholder="email@cliente.com" value={formData.comercial_email} onChange={e => handleInputChange('comercial_email', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="comercial_telefone">Comercial - Telefone</Label>
                            <Input id="comercial_telefone" placeholder="(00) 00000-0000" value={formData.comercial_telefone} onChange={e => handleInputChange('comercial_telefone', e.target.value)} />
                        </div>
                    </div>
                     <div className="grid gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="logistica_nome">Logística - Nome</Label>
                            <Input id="logistica_nome" placeholder="Nome do contato de logística" value={formData.logistica_nome} onChange={e => handleInputChange('logistica_nome', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="logistica_email">Logística - E-mail</Label>
                            <Input id="logistica_email" type="email" placeholder="email@cliente.com" value={formData.logistica_email} onChange={e => handleInputChange('logistica_email', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="logistica_telefone">Logística - Telefone</Label>
                            <Input id="logistica_telefone" placeholder="(00) 00000-0000" value={formData.logistica_telefone} onChange={e => handleInputChange('logistica_telefone', e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>

             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/cadastros/clientes" passHref>
                    <Button variant="outline">Cancelar</Button>
                  </Link>
                  <Button type="submit">Salvar</Button>
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
