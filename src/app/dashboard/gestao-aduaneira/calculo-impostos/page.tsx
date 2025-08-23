
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CalculoImpostosPage() {
    const [totalValue, setTotalValue] = useState(0);

  return (
    <div className="grid md:grid-cols-3 gap-6 items-start">
        <Card className="md:col-span-2">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-md">
                        <Calculator className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle>Calculadora de Impostos e Custos de Exportação</CardTitle>
                        <CardDescription>
                        Estime os valores para sua operação de exportação.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
                    <div className="space-y-4 p-4 border rounded-lg">
                         <h3 className="font-semibold">1. Base de Cálculo</h3>
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product">Produto</Label>
                                <Select>
                                <SelectTrigger id="product">
                                    <SelectValue placeholder="Selecione um produto cadastrado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cafe">Café Especial Torrado (NCM 0901.21.00)</SelectItem>
                                    <SelectItem value="soja">Soja em Grãos (NCM 1201.90.00)</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="client">Cliente (Importador)</Label>
                                <Select>
                                <SelectTrigger id="client">
                                    <SelectValue placeholder="Selecione um cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cliente1">Importadora Exemplo LLC (EUA)</SelectItem>
                                    <SelectItem value="cliente2">Global Trade Corp (Argentina)</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fob-value">Valor do Produto (FOB)</Label>
                                <Input id="fob-value" type="number" placeholder="20000.00" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Moeda</Label>
                                <Select defaultValue="usd">
                                <SelectTrigger id="currency">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usd">USD</SelectItem>
                                    <SelectItem value="eur">EUR</SelectItem>
                                    <SelectItem value="brl">BRL</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="exchange-rate">Taxa de Câmbio (p/ BRL)</Label>
                                <Input id="exchange-rate" type="number" placeholder="5.45" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-semibold">2. Custos Logísticos</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="freight-cost">Custo do Frete Internacional</Label>
                                <Input id="freight-cost" type="number" placeholder="1500.00" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="insurance-cost">Custo do Seguro</Label>
                                <Input id="insurance-cost" type="number" placeholder="300.00" />
                            </div>
                        </div>
                    </div>

                     <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-semibold">3. Impostos (Simulação)</h3>
                        <p className="text-sm text-muted-foreground">
                            As alíquotas podem variar. Esta é uma estimativa.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="ie-tax">I.E. (Imposto de Exportação)</Label>
                                <div className="flex items-center gap-2">
                                    <Input id="ie-tax" type="number" placeholder="9.0" className="w-24" />
                                    <span className="text-muted-foreground">%</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pis-tax">PIS</Label>
                                <div className="flex items-center gap-2">
                                    <Input id="pis-tax" type="number" placeholder="1.65" className="w-24" />
                                    <span className="text-muted-foreground">%</span>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="cofins-tax">COFINS</Label>
                                 <div className="flex items-center gap-2">
                                    <Input id="cofins-tax" type="number" placeholder="7.60" className="w-24" />
                                    <span className="text-muted-foreground">%</span>
                                </div>
                            </div>
                        </div>
                     </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-end">
                 <Button>
                    <Calculator className="mr-2 h-4 w-4" />
                    Calcular
                </Button>
            </CardFooter>
        </Card>
        <Card className="md:col-span-1 sticky top-6">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-green-500/10 text-green-600 p-3 rounded-md">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <CardTitle>Resumo do Cálculo</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor dos Produtos (FOB)</span>
                        <span className="font-medium">USD 20.000,00</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Frete</span>
                        <span className="font-medium">USD 1.500,00</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Seguro</span>
                        <span className="font-medium">USD 300,00</span>
                    </div>
                     <div className="flex justify-between text-base font-semibold">
                        <span className="text-foreground">Valor CIF</span>
                        <span className="text-primary">USD 21.800,00</span>
                    </div>
                </div>
                <Separator />
                 <div className="space-y-2 text-sm">
                     <h4 className="font-semibold mb-2">Estimativa de Impostos (BRL)</h4>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Base de Cálculo (BRL)</span>
                        <span>R$ 109.000,00</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Imposto de Exportação (9%)</span>
                        <span>R$ 9.810,00</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">PIS (1.65%)</span>
                        <span>R$ 1.798,50</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">COFINS (7.60%)</span>
                        <span>R$ 8.284,00</span>
                    </div>
                 </div>
                 <Separator />
                  <div className="space-y-2 text-sm">
                     <h4 className="font-semibold mb-2">Total</h4>
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-foreground">Valor Total (CIF + Impostos)</span>
                        <span className="text-primary">USD 25.590,00</span>
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                        Valor aproximado em Reais (BRL): R$ 139.465,50. Câmbio: 5.45.
                    </p>
                  </div>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" className="w-full">Exportar Simulação (PDF)</Button>
            </CardFooter>
        </Card>
    </div>
  );
}
