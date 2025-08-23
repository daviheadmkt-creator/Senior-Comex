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
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown } from 'lucide-react';

export default function ConhecimentoEmbarquePage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Emissão de Conhecimento de Embarque (B/L ou AWB)</CardTitle>
            <CardDescription>
              Preencha os campos para gerar um novo documento de embarque.
            </CardDescription>
          </div>
          <Button>
            <FileDown className="mr-2 h-4 w-4" />
            Gerar PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-8">
          <Accordion type="multiple" defaultValue={['item-1', 'item-2']}>
            <AccordionItem value="item-1">
              <AccordionTrigger>1. Partes Envolvidas</AccordionTrigger>
               <AccordionContent className="space-y-6 p-1">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 border rounded-md">
                         <h4 className="font-semibold">Embarcador (Shipper)</h4>
                         <p className="text-sm text-muted-foreground">
                            <strong>Razão Social:</strong> Senior Assessoria em Comércio Exterior Ltda<br />
                            <strong>Endereço:</strong> Avenida Brasil, 1234, São Paulo - SP, Brasil<br />
                            <strong>CNPJ:</strong> 00.123.456/0001-00<br />
                            <strong>Contato:</strong> contato@seniorcomex.com / (11) 98765-4321
                         </p>
                    </div>
                     <div className="space-y-4 p-4 border rounded-md">
                         <h4 className="font-semibold">Consignatário (Consignee)</h4>
                         <div className="space-y-2">
                            <Label htmlFor="cliente">Selecione o Cliente</Label>
                            <Select>
                                <SelectTrigger id="cliente">
                                    <SelectValue placeholder="Selecione um cliente cadastrado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cliente1">Importadora Exemplo LLC</SelectItem>
                                    <SelectItem value="cliente2">Global Trade Corp</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                         <p className="text-sm text-muted-foreground">
                            <strong>Endereço:</strong> 1234 Main Street, New York, NY, USA<br />
                            <strong>País:</strong> Estados Unidos<br />
                            <strong>Tax ID:</strong> 98-7654321<br />
                             <strong>Contato:</strong> John Doe / john.doe@example.com
                         </p>
                    </div>
                 </div>
                 <div className="space-y-4 p-4 border rounded-md">
                     <h4 className="font-semibold">Notificante (Notify Party)</h4>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="notify-name">Nome / Razão Social</Label>
                            <Input id="notify-name" placeholder="Agente ou Despachante" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notify-contact">Contato</Label>
                            <Input id="notify-contact" placeholder="Telefone ou e-mail" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="notify-address">Endereço Completo</Label>
                        <Textarea id="notify-address" placeholder="Rua, número, cidade, estado, CEP, país" />
                     </div>
                  </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>2. Detalhes do Embarque</AccordionTrigger>
              <AccordionContent className="space-y-4 p-1">
                 <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="bl-number">Número do B/L ou AWB</Label>
                        <Input id="bl-number" placeholder="MSC123456789" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="issue-date">Data de Emissão</Label>
                        <Input id="issue-date" type="date" />
                    </div>
                     <div className="space-y-2">
                        <Label>Tipo de Transporte</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o modal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="maritimo">Marítimo</SelectItem>
                                <SelectItem value="aereo">Aéreo</SelectItem>
                                <SelectItem value="rodoviario">Rodoviário</SelectItem>
                                <SelectItem value="ferroviario">Ferroviário</SelectItem>
                            </SelectContent>
                        </Select>
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
                 <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="carrier-name">Nome do Navio / Cia Aérea</Label>
                        <Input id="carrier-name" placeholder="MSC FANTASIA" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="voyage-flight">Número da Viagem / Voo</Label>
                        <Input id="voyage-flight" placeholder="V001N" />
                    </div>
                    <div className="space-y-2">
                        <Label>Incoterm</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o Incoterm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fob">FOB</SelectItem>
                                <SelectItem value="cif">CIF</SelectItem>
                                <SelectItem value="exw">EXW</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="freight-forwarder">Agente de Carga</Label>
                    <Input id="freight-forwarder" placeholder="Nome do agente" />
                </div>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-3">
              <AccordionTrigger>3. Detalhes da Carga</AccordionTrigger>
              <AccordionContent className="space-y-4 p-1">
                 <div className="space-y-2">
                    <Label htmlFor="cargo-description">Descrição da Mercadoria</Label>
                    <Textarea id="cargo-description" placeholder="Ex: Café em grãos, 1000 sacas de 60kg" />
                </div>
                 <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="packages-count">Número de Volumes</Label>
                        <Input id="packages-count" type="number" placeholder="1000" />
                    </div>
                    <div className="space-y-2">
                        <Label>Tipo de Embalagem</Label>
                        <Input id="package-type" placeholder="Sacas de Juta" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="marks-numbers">Marcas e Numeração</Label>
                        <Input id="marks-numbers" placeholder="N/M" />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="gross-weight">Peso Bruto (kg)</Label>
                        <Input id="gross-weight" type="number" placeholder="60500.00" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="net-weight">Peso Líquido (kg)</Label>
                        <Input id="net-weight" type="number" placeholder="60000.00" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensões (m³ ou cm)</Label>
                    <Input id="dimensions" placeholder="Ex: 1 container de 20 pés" />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>4. Instruções Adicionais e Declaração</AccordionTrigger>
              <AccordionContent className="space-y-4 p-1">
                 <div className="space-y-2">
                    <Label htmlFor="special-instructions">Instruções Especiais</Label>
                    <Textarea id="special-instructions" placeholder="Manusear com cuidado. Carga frágil." />
                 </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="insurance" />
                    <Label htmlFor="insurance" className="font-normal">
                        Carga segurada
                    </Label>
                </div>
                 <div className="space-y-4 p-4 border rounded-md mt-4">
                     <h4 className="font-semibold">Declaração do Transportador</h4>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="carrier-signature">Assinatura Digital ou Anexo</Label>
                            <Input id="carrier-signature" type="file" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="carrier-date">Data da Assinatura</Label>
                            <Input id="carrier-date" type="date" />
                        </div>
                     </div>
                 </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button">Cancelar</Button>
            <Button type="submit">Salvar Conhecimento</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
