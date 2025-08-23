
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, ShieldAlert, ShieldX, Loader2, ListChecks, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateEntity, ValidateEntityOutput } from '@/ai/flows/validate-entity-flow';

type ValidationHistory = ValidateEntityOutput & {
    entityName: string;
    country: string;
    date: string;
};

const getStatusVariant = (status: ValidateEntityOutput['status']) => {
    switch (status) {
        case 'Liberado':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'Atenção':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Sancionado':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusIcon = (status: ValidateEntityOutput['status']) => {
    switch (status) {
        case 'Liberado':
            return <CheckCircle className="h-4 w-4" />;
        case 'Atenção':
            return <AlertCircle className="h-4 w-4" />;
        case 'Sancionado':
            return <XCircle className="h-4 w-4" />;
        default:
            return null;
    }
}


export default function ValidacaoClientesPaisesPage() {
    const [entityName, setEntityName] = useState('');
    const [country, setCountry] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ValidateEntityOutput | null>(null);
    const [history, setHistory] = useState<ValidationHistory[]>([]);
    const { toast } = useToast();

    const handleValidation = async () => {
        if (!entityName.trim() || !country.trim()) {
            toast({
                title: "Campos obrigatórios",
                description: "Por favor, preencha o nome da entidade e o país.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const validationResult = await validateEntity({ entityName, country });
            setResult(validationResult);
            const newHistoryEntry: ValidationHistory = {
                ...validationResult,
                entityName,
                country,
                date: new Date().toLocaleDateString('pt-BR')
            };
            setHistory([newHistoryEntry, ...history]);
        } catch (error) {
            console.error("Erro ao validar entidade:", error);
            toast({
                title: "Falha na Validação",
                description: "Ocorreu um erro ao tentar validar a entidade. Tente novamente.",
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
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>Validação de Clientes e Países (IA)</CardTitle>
                    <CardDescription>
                    Verifique clientes, fornecedores e países em listas de sanções internacionais.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="entity-name">Nome da Entidade (Empresa ou Pessoa)</Label>
                    <Input id="entity-name" placeholder="Ex: Global Trade Corp" value={entityName} onChange={(e) => setEntityName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="country-name">País</Label>
                    <Input id="country-name" placeholder="Ex: Iran" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleValidation} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Verificar Agora
            </Button>
        </CardFooter>
        </Card>

        {isLoading && (
            <div className="flex items-center justify-center pt-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}

        {result && (
            <Alert className={getStatusVariant(result.status)}>
                 {result.status === 'Liberado' && <ShieldCheck className="h-4 w-4" />}
                 {result.status === 'Atenção' && <ShieldAlert className="h-4 w-4" />}
                 {result.status === 'Sancionado' && <ShieldX className="h-4 w-4" />}
                <AlertTitle className="font-bold text-lg">Resultado: {result.status}</AlertTitle>
                <AlertDescription className="space-y-2 mt-2">
                    <p>{result.justification}</p>
                    <div className="flex items-center gap-2 text-xs">
                        <ListChecks className="h-4 w-4" />
                        <strong>Listas Verificadas:</strong> {result.checkedLists.join(', ')}
                    </div>
                </AlertDescription>
            </Alert>
        )}

        <Card>
            <CardHeader>
                <CardTitle>Histórico de Verificações</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Entidade</TableHead>
                        <TableHead>País</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhuma verificação realizada ainda.</TableCell>
                            </TableRow>
                        )}
                        {history.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.date}</TableCell>
                                <TableCell className="font-medium">{item.entityName}</TableCell>
                                <TableCell>{item.country}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusVariant(item.status)}>
                                        {getStatusIcon(item.status)}
                                        <span className="ml-1">{item.status}</span>
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
