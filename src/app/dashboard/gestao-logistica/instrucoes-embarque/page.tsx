
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileDown, PlusCircle, Trash2 } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
} from '@/components/ui/table';

export default function InstrucoesEmbarquePage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Emissão de Instrução de Embarque</CardTitle>
            <CardDescription>
              Preencha os campos para gerar o "booking" com a transportadora.
            </CardDescription>
          </div>
          <Button>
            <FileDown className="mr-2 h-4 w-4" />
            Gerar PDF/Enviar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-8">
          <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4']}>
            <AccordionItem value="item-1">
              <AccordionTrigger>1. Informações Gerais</AccordionTrigger>
              <AccordionContent className="space-y-4 p-1">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instruction-number">Nº da Instrução</Label>
                    <Input id="instruction-number" value="IE-2024-001" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue-date">Data de Emissão</Label>
                    <Input id="issue-date" type="date" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="invoice-ref">Pedido / Fatura de Referência</Label>
                    <Input id="invoice-ref" placeholder="PED-001 / CI-2024-001" />
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="freight-forwarder">Transportadora / Agente de Carga</Label>
                    <Select>
                        <SelectTrigger id="freight-forwarder">
                            <SelectValue placeholder="Selecione um parceiro logístico" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="maersk">Maersk Line</SelectItem>
                            <SelectItem value="msc">MSC</SelectItem>
                            <SelectItem value="dhl">DHL</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>2. Partes Envolvidas</AccordionTrigger>
              <AccordionContent className="space-y-6 p-1">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 border rounded-md">
                         <h4 className="font-semibold">Embarcador (Shipper)</h4>
                         <p className="text-sm text-muted-foreground">
                            <strong>Razão Social:</strong> Senior Assessoria em Comércio Exterior Ltda<br />
                            <strong>Endereço:</strong> Avenida Brasil, 1234, São Paulo - SP, Brasil<br />
                            <strong>CNPJ:</strong> 00.123.456/0001-00
                         </p>
                    </div>
                     <div className="space-y-4 p-4 border rounded-md">
                         <h4 className="font-semibold">Consignatário (Consignee)</h4>
                         <div className="space-y-2">
                            <Label htmlFor="cliente">Selecione o Cliente</Label>
                            <Select>
                                <SelectTrigger id="cliente">
                                    <SelectValue placeholder="Selecione um cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cliente1">Importadora Exemplo LLC</SelectItem>
                                    <SelectItem value="cliente2">Global Trade Corp</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                         <p className="text-sm text-muted-foreground">
                            <strong>Endereço:</strong> 1234 Main Street, New York, NY, USA
                         </p>
                    </div>
                 </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>3. Detalhes da Carga e Rota</AccordionTrigger>
              <AccordionContent className="space-y-4 p-1">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="collect-address">Endereço de Coleta da Mercadoria</Label>
                    <Input id="collect-address" placeholder="Rua da Fábrica, 100, São Paulo, SP" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="readiness-date">Data de Prontidão da Carga</Label>
                    <Input id="readiness-date" type="date" />
                  </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="port-loading">Porto / Aeroporto de Embarque</Label>
                        <Input id="port-loading" placeholder="Porto de Santos" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="port-destination">Porto / Aeroporto de Destino</Label>
                        <Input id="port-destination" placeholder="Port of New York" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Descrição da Mercadoria</Label>
                    <Textarea placeholder="Ex: Café Torrado Especial, 1000 Caixas" />
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="total-packages">Total de Volumes</Label>
                        <Input id="total-packages" type="number" placeholder="1000" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="gross-weight">Peso Bruto (kg)</Label>
                        <Input id="gross-weight" type="number" placeholder="10500.50" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="net-weight">Peso Líquido (kg)</Label>
                        <Input id="net-weight" type="number" placeholder="10000.00" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="volume">Volume (m³)</Label>
                        <Input id="volume" type="number" placeholder="15.5" />
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-4">
              <AccordionTrigger>4. Instruções Adicionais</AccordionTrigger>
              <AccordionContent className="space-y-4 p-1">
                 <div className="space-y-2">
                    <Label>Incoterm</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o Incoterm da negociação" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fob">FOB</SelectItem>
                            <SelectItem value="cif">CIF</SelectItem>
                            <SelectItem value="exw">EXW</SelectItem>
                             <SelectItem value="cfr">CFR</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                 <div className="space-y-2">
                    <Label htmlFor="special-instructions">Instruções especiais para a transportadora</Label>
                    <Textarea id="special-instructions" placeholder="Ex: Carga frágil. Necessário contêiner refrigerado a 15°C. Documentos devem ser enviados para despachante@email.com." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deadline">Prazo para confirmação do booking</Label>
                    <Input id="deadline" type="date" />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button">Cancelar</Button>
            <Button type="submit">Salvar e Enviar Instrução</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
