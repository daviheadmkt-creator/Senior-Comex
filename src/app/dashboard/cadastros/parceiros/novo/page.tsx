'use client';

import { useState, useEffect } from 'react';
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
import { ArrowLeft, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';

const partnerTypes = [
    "Cliente (Importador)",
    "Exportador",
    "Produto",
    "Despachante Aduaneiro",
    "Agente de Carga",
    "Armador",
    "Terminal de Embarque",
    "Terminal de Descarga",
    "Empresa de Inspeção",
    "Empresa de Fumigação",
    "Transportadora Terrestre",
    "Representante Local",
]

const initialFormData = {
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  tipo_parceiro: '',
  endereco: '',
  cidade: '',
  estado: '',
  cep: '',
  pais: '',
  contatos: [{ nome: '', email: '', telefone: '', cargo: '' }],
};

export default function NovoParceiroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();
  
  const [formData, setFormData] = useState(initialFormData);
  const [isLoadingCnpj, setIsLoadingCnpj] = useState(false);

  const isEditing = searchParams.has('edit');
  const partnerId = searchParams.get('id');

  const partnerDocRef = useMemoFirebase(() => {
    if (!firestore || !partnerId) return null;
    return doc(firestore, 'partners', partnerId);
  }, [firestore, partnerId]);

  const { data: partnerData, isLoading: isPartnerLoading } = useDoc(partnerDocRef);

  useEffect(() => {
    if (isEditing && partnerId && partnerData) {
      setFormData({
        razao_social: partnerData.razao_social || '',
        nome_fantasia: partnerData.nome_fantasia || '',
        cnpj: partnerData.cnpj || '',
        tipo_parceiro: partnerData.tipo_parceiro || '',
        endereco: partnerData.endereco || '',
        cidade: partnerData.cidade || '',
        estado: partnerData.estado || '',
        cep: partnerData.cep || '',
        pais: partnerData.pais || '',
        contatos: partnerData.contatos && partnerData.contatos.length > 0 ? partnerData.contatos : [{ nome: '', email: '', telefone: '', cargo: '' }]
      });
    }
  }, [isEditing, partnerId, partnerData]);


  const pageTitle = isEditing ? 'Editar Parceiro' : 'Novo Parceiro';
  const pageDescription = isEditing
    ? 'Altere as informações do parceiro selecionado.'
    : 'Adicione um novo parceiro (cliente, fornecedor, etc) à sua base.';
    
  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({...prev, [id]: value}));
  }
  
  const handleContactChange = (index: number, field: string, value: string) => {
    const updatedContacts = [...formData.contatos];
    updatedContacts[index] = {...updatedContacts[index], [field]: value};
    setFormData(prev => ({...prev, contatos: updatedContacts}));
  };

  const addContact = () => {
    setFormData(prev => ({
        ...prev,
        contatos: [...prev.contatos, { nome: '', email: '', telefone: '', cargo: '' }]
    }));
  };

  const removeContact = (index: number) => {
    const updatedContacts = formData.contatos.filter((_, i) => i !== index);
    setFormData(prev => ({...prev, contatos: updatedContacts}));
  };

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
            pais: 'Brasil',
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
    if (!firestore) return;

    const docId = partnerId || doc(collection(firestore, 'partners')).id;
    const partnerRef = doc(firestore, 'partners', docId);

    setDocumentNonBlocking(partnerRef, formData, { merge: true });
    
    toast({
        title: "Sucesso!",
        description: `O parceiro foi ${isEditing ? 'atualizado' : 'salvo'}.`,
        variant: "default",
    });

    router.push('/dashboard/cadastros/parceiros');
  };


  if (isPartnerLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
             <div className='flex items-center gap-4'>
                <Link href="/dashboard/cadastros/parceiros" passHref>
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
              <div className="space-y-2 relative">
                <Label htmlFor="cnpj">CNPJ / CPF / ID Fiscal</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={e => handleInputChange('cnpj', e.target.value)} onBlur={handleCnpjBlur} />
                 {isLoadingCnpj && <Loader2 className="absolute right-3 top-9 h-5 w-5 animate-spin text-muted-foreground" />}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_parceiro">Tipo de Parceiro (Função)</Label>
                <Select value={formData.tipo_parceiro} onValueChange={value => handleInputChange('tipo_parceiro', value)}>
                    <SelectTrigger id="tipo_parceiro">
                        <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        {partnerTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
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
            <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" placeholder="Rua, número, bairro..." value={formData.endereco} onChange={e => handleInputChange('endereco', e.target.value)} />
            </div>
             <div className="grid md:grid-cols-4 gap-4">
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
                   <div className="space-y-2">
                      <Label htmlFor="pais">País</Label>
                      <Input id="pais" placeholder="Insira o país" value={formData.pais} onChange={e => handleInputChange('pais', e.target.value)} />
                  </div>
             </div>
             
             <Separator />

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Contatos</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addContact}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Contato
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>E-mail</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Cargo</TableHead>
                                <TableHead>Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formData.contatos.map((contact, index) => (
                                <TableRow key={index}>
                                    <TableCell><Input value={contact.nome || ''} onChange={e => handleContactChange(index, 'nome', e.target.value)} placeholder="Nome do contato" /></TableCell>
                                    <TableCell><Input value={contact.email || ''} type="email" onChange={e => handleContactChange(index, 'email', e.target.value)} placeholder="email@parceiro.com" /></TableCell>
                                    <TableCell><Input value={contact.telefone || ''} onChange={e => handleContactChange(index, 'telefone', e.target.value)} placeholder="(00) 00000-0000" /></TableCell>
                                    <TableCell><Input value={contact.cargo || ''} onChange={e => handleContactChange(index, 'cargo', e.target.value)} placeholder="Cargo do contato" /></TableCell>
                                    <TableCell>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeContact(index)} disabled={formData.contatos.length === 1}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

             <div className="flex justify-end gap-2 pt-4">
                  <Link href="/dashboard/cadastros/parceiros" passHref>
                    <Button variant="outline" type="button">Cancelar</Button>
                  </Link>
                  <Button type="submit">Salvar</Button>
             </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
