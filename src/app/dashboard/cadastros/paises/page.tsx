import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PaisesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro de Países, Moedas e Taxas de Câmbio</CardTitle>
        <CardDescription>
          Gerencie as configurações globais de localização e financeiras.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paises">
          <TabsList className="mb-4">
            <TabsTrigger value="paises">Países</TabsTrigger>
            <TabsTrigger value="moedas">Moedas</TabsTrigger>
            <TabsTrigger value="cambio">Taxas de Câmbio</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>
          <TabsContent value="paises" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Países</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome-pais">Nome do país</Label>
                        <Input id="nome-pais" placeholder="Brasil" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="codigo-telefonico">Código telefônico</Label>
                        <Input id="codigo-telefonico" placeholder="+55" />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="codigo-iso-a2">Código ISO (Alpha-2)</Label>
                        <Input id="codigo-iso-a2" placeholder="BR" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="codigo-iso-a3">Código ISO (Alpha-3)</Label>
                        <Input id="codigo-iso-a3" placeholder="BRA" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="idiomas">Idioma(s) oficial(is)</Label>
                    <Input id="idiomas" placeholder="Português" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="portos-aeroportos">Portos e aeroportos principais</Label>
                    <Textarea id="portos-aeroportos" placeholder="Porto de Santos, Aeroporto de Guarulhos..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="relacoes-comerciais">Relações comerciais (restrições, sanções)</Label>
                    <Textarea id="relacoes-comerciais" placeholder="Países com restrições ou embargos..." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="obs-paises">Observações internas</Label>
                    <Textarea id="obs-paises" placeholder="Ex: Necessário certificado fitossanitário..." />
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar País
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="moedas" className="space-y-6">
             <Card>
              <CardHeader>
                <CardTitle>Cadastro de Moedas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome-moeda">Nome da moeda</Label>
                        <Input id="nome-moeda" placeholder="Dólar Americano" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="codigo-iso-moeda">Código ISO</Label>
                        <Input id="codigo-iso-moeda" placeholder="USD" />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="simbolo-moeda">Símbolo</Label>
                        <Input id="simbolo-moeda" placeholder="$" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="casas-decimais">Casas decimais</Label>
                        <Input id="casas-decimais" type="number" placeholder="2" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="paises-uso">País(es) de uso</Label>
                    <Input id="paises-uso" placeholder="Estados Unidos, Equador..." />
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Moeda
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
           <TabsContent value="cambio" className="space-y-6">
             <Card>
              <CardHeader>
                <CardTitle>Cadastro de Taxas de Câmbio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="moeda-base">Moeda base</Label>
                      <Input id="moeda-base" defaultValue="BRL" readOnly />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="moeda-estrangeira">Moeda estrangeira</Label>
                       <Select>
                          <SelectTrigger id="moeda-estrangeira">
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="eur">EUR</SelectItem>
                            <SelectItem value="gbp">GBP</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="taxa-conversao">Taxa de conversão</Label>
                        <Input id="taxa-conversao" type="number" placeholder="5.45" />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                        <Label htmlFor="data-vigencia">Data de vigência</Label>
                        <Input id="data-vigencia" type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fonte-cotacao">Fonte da cotação</Label>
                        <Input id="fonte-cotacao" placeholder="Banco Central do Brasil" />
                    </div>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Taxa
                </Button>
              </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Histórico de Cotações</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Moeda</TableHead>
                                <TableHead>Taxa</TableHead>
                                <TableHead>Fonte</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>15/07/2024</TableCell>
                                <TableCell>USD</TableCell>
                                <TableCell>R$ 5,45</TableCell>
                                <TableCell>Banco Central</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>14/07/2024</TableCell>
                                <TableCell>USD</TableCell>
                                <TableCell>R$ 5,42</TableCell>
                                <TableCell>Banco Central</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
          </TabsContent>
           <TabsContent value="configuracoes" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configurações Gerais</CardTitle>
                        <CardDescription>Defina as moedas padrão do sistema.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Moeda padrão do sistema</Label>
                                <Select defaultValue="brl">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="brl">BRL (Real Brasileiro)</SelectItem>
                                        <SelectItem value="usd">USD (Dólar Americano)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Moeda padrão de exportação</Label>
                                <Select defaultValue="usd">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usd">USD (Dólar Americano)</SelectItem>
                                        <SelectItem value="eur">EUR (Euro)</SelectItem>
                                        <SelectItem value="gbp">GBP (Libra Esterlina)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label>Definição da moeda de faturamento por cliente</Label>
                            <p className="text-sm text-muted-foreground">
                                A moeda de faturamento pode ser definida individualmente no cadastro de cada <a href="/dashboard/cadastros/clientes" className="text-primary underline">cliente internacional</a>.
                            </p>
                        </div>
                        <Button>Salvar Configurações</Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
