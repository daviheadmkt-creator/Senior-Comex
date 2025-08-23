
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { BookText, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { classifyProduct } from '@/ai/flows/classify-product-flow';
import { useToast } from "@/hooks/use-toast";


export default function ClassificacaoFiscalPage() {
    const [description, setDescription] = useState('');
    const [classification, setClassification] = useState<{ ncmCode: string; hsCode: string; justification: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleClassify = async () => {
        if (!description.trim()) {
             toast({
                title: "Erro",
                description: "Por favor, insira a descrição do produto.",
                variant: "destructive",
            });
            return;
        }
        setIsLoading(true);
        setClassification(null);
        try {
            const result = await classifyProduct({ productDescription: description });
            setClassification(result);
        } catch (error) {
            console.error("Erro ao classificar produto:", error);
            toast({
                title: "Falha na Classificação",
                description: "Ocorreu um erro ao tentar classificar o produto. Tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
             <div className="bg-primary/10 text-primary p-3 rounded-md">
                <Wand2 className="h-6 w-6" />
             </div>
             <div>
                <CardTitle>Assistente de Classificação Fiscal (IA)</CardTitle>
                <CardDescription>
                Descreva seu produto e a IA irá sugerir o NCM e HS Code mais adequados.
                </CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="product-description">Descrição detalhada do produto</Label>
                <Textarea
                    id="product-description"
                    placeholder="Ex: Café torrado e moído, em grãos, não descafeinado, embalado a vácuo em pacotes de 1kg."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
             <Button onClick={handleClassify} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Sugerir Classificação
            </Button>
            {isLoading && (
                 <div className="flex items-center justify-center pt-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {classification && (
                <div className="pt-4 space-y-4">
                    <Card className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Sugestão da IA</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>NCM Sugerido</Label>
                                    <p className="font-mono text-lg font-semibold text-primary">{classification.ncmCode}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label>HS Code Sugerido</Label>
                                    <p className="font-mono text-lg font-semibold text-primary">{classification.hsCode}</p>
                                </div>
                            </div>
                             <div className="space-y-1">
                                <Label>Justificativa</Label>
                                <p className="text-sm text-muted-foreground">{classification.justification}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
             <div className="bg-primary/10 text-primary p-3 rounded-md">
                <BookText className="h-6 w-6" />
             </div>
             <div>
                <CardTitle>Produtos Cadastrados</CardTitle>
                <CardDescription>
                Gerencie a classificação fiscal dos seus produtos.
                </CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">SKU</TableHead>
                <TableHead className="w-[35%]">Produto</TableHead>
                <TableHead className="w-[20%]">NCM</TableHead>
                <TableHead className="w-[20%]">HS Code</TableHead>
                 <TableHead className="w-[10%] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>SKU-12345</TableCell>
                <TableCell>Café Especial Torrado</TableCell>
                <TableCell><Input defaultValue="0901.21.00" /></TableCell>
                <TableCell><Input defaultValue="0901.21" /></TableCell>
                <TableCell className="text-center">
                    <Button variant="ghost" size="sm">Salvar</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>SKU-67890</TableCell>
                <TableCell>Soja em Grãos</TableCell>
                <TableCell><Input defaultValue="1201.90.00" /></TableCell>
                <TableCell><Input defaultValue="1201.90" /></TableCell>
                 <TableCell className="text-center">
                    <Button variant="ghost" size="sm">Salvar</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
