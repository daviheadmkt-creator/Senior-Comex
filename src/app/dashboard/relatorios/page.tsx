'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
} from 'recharts';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2, Download, Printer, Mail, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const COLORS = ['#4DB6AC', '#80CBC4', '#26A69A', '#00897B', '#00796B', '#00695C'];

// Mapeamento de status para percentagem de progresso
const getStatusProgress = (status: string): number => {
  if (!status) return 0;
  const s = status.toUpperCase();
  if (s === 'CONCLUÍDO') return 100;
  if (s === 'CANCELADO') return 0;
  
  if (s.includes('NOMEAÇÃO')) return 10;
  if (s.includes('DRAFT ENVIADOS')) return 30;
  if (s.includes('DUE REGISTRADA') || s.includes('LPCO')) return 50;
  if (s.includes('LIBERADO PARA EMBARQUE')) return 70;
  if (s.includes('PROCESSO EMBARCADO')) return 85;
  if (s.includes('SET DOC ENVIADOS')) return 95;
  
  return 40; // Default para status intermédios
};

const getStatusColor = (status: string) => {
  const s = status?.toLowerCase() || '';
  if (s.includes('atrasado') || s.includes('exigencia') || s.includes('cancelado')) return 'text-red-600 bg-red-50 border-red-100';
  if (s.includes('concluído') || s.includes('liberado') || s.includes('embarcado')) return 'text-green-600 bg-green-50 border-green-100';
  if (s.includes('aguardando') || s.includes('analise')) return 'text-orange-600 bg-orange-50 border-orange-100';
  return 'text-blue-600 bg-blue-50 border-blue-100';
};

export default function RelatoriosPage() {
  const firestore = useFirestore();
  
  const processosCollection = useMemoFirebase(() => firestore ? collection(firestore, 'processos') : null, [firestore]);
  const { data: processos, isLoading } = useCollection(processosCollection);

  const stats = useMemo(() => {
    if (!processos) return { perAnalyst: [], perPort: [], groupedByAnalyst: {} };

    const analystMap: Record<string, number> = {};
    const portMap: Record<string, number> = {};
    const groupedByAnalyst: Record<string, any[]> = {};

    processos.forEach(p => {
      const analyst = p.analistaNome || 'Sem Analista';
      
      // Gráfico de Barras
      analystMap[analyst] = (analystMap[analyst] || 0) + 1;

      // Gráfico de Pizza
      const port = p.portoEmbarqueNome || 'N/A';
      portMap[port] = (portMap[port] || 0) + 1;

      // Agrupamento detalhado
      if (!groupedByAnalyst[analyst]) {
        groupedByAnalyst[analyst] = [];
      }
      groupedByAnalyst[analyst].push(p);
    });

    const perAnalyst = Object.entries(analystMap).map(([name, value]) => ({ name, value }));
    const perPort = Object.entries(portMap).map(([name, value]) => ({ name, value }));

    return { perAnalyst, perPort, groupedByAnalyst };
  }, [processos]);

  const handleNotifyAnalyst = (analystName: string, processList: any[]) => {
    const activeProcesses = processList.filter(p => p.status !== 'Concluído' && p.status !== 'Cancelado');
    if (activeProcesses.length === 0) return;

    const subject = encodeURIComponent(`Follow-up de Processos: ${analystName}`);
    let bodyText = `Olá ${analystName},\n\nSegue resumo do andamento dos seus processos ativos no SeniorComex:\n\n`;
    
    activeProcesses.forEach(p => {
      bodyText += `- Processo: ${p.processo_interno || 'N/A'} (PO: ${p.po_number || 'N/A'})\n`;
      bodyText += `  Status Atual: ${p.status}\n`;
      bodyText += `  Progresso: ${getStatusProgress(p.status)}%\n\n`;
    });

    bodyText += `Por favor, verifique as pendências no sistema.\n\nAtenciosamente,\nGestão SeniorComex`;
    
    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios e Performance</h1>
          <p className="text-muted-foreground">Análise de produtividade por analista e fluxo de processos.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" /> Exportar Global
          </Button>
        </div>
      </div>

      {/* Seção de Gráficos de Resumo */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Processos por Analista</CardTitle>
            <CardDescription>Carga de trabalho distribuída.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.perAnalyst}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(77, 182, 172, 0.1)' }}
                />
                <Bar dataKey="value" fill="#4DB6AC" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Volume por Porto</CardTitle>
            <CardDescription>Distribuição logística.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.perPort}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.perPort.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Seção Detalhada por Analista */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-1 w-6 bg-primary rounded-full" />
          <h2 className="text-xl font-bold">Andamento por Analista</h2>
        </div>

        <div className="grid gap-6">
          {Object.entries(stats.groupedByAnalyst).map(([analystName, analystProcessos]) => {
            const activeCount = analystProcessos.filter(p => p.status !== 'Concluído' && p.status !== 'Cancelado').length;
            const completedCount = analystProcessos.filter(p => p.status === 'Concluído').length;

            return (
              <Card key={analystName} className="overflow-hidden border-l-4 border-l-primary">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {analystName.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{analystName}</CardTitle>
                        <CardDescription className="flex gap-3 mt-1">
                          <span className="flex items-center text-orange-600 font-medium">
                            <Clock className="h-3 w-3 mr-1" /> {activeCount} Ativos
                          </span>
                          <span className="flex items-center text-green-600 font-medium">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> {completedCount} Concluídos
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-primary border-primary/20 hover:bg-primary/5"
                      onClick={() => handleNotifyAnalyst(analystName, analystProcessos)}
                      disabled={activeCount === 0}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Notificar Analista por E-mail
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 text-muted-foreground font-medium text-[11px] uppercase tracking-wider">
                          <th className="px-6 py-3 text-left">Processo / PO</th>
                          <th className="px-6 py-3 text-left">Status Atual</th>
                          <th className="px-6 py-3 text-left">Andamento</th>
                          <th className="px-6 py-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {analystProcessos
                          .sort((a, b) => getStatusProgress(b.status) - getStatusProgress(a.status))
                          .map((p) => {
                            const progress = getStatusProgress(p.status);
                            return (
                              <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-foreground">{p.processo_interno || 'N/A'}</span>
                                    <span className="text-xs text-muted-foreground">PO: {p.po_number || '---'}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 font-bold border", getStatusColor(p.status))}>
                                    {p.status}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 min-w-[200px]">
                                  <div className="flex items-center gap-3">
                                    <Progress value={progress} className="h-2 flex-1" />
                                    <span className="text-[11px] font-mono font-bold text-muted-foreground w-8">{progress}%</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                    <a href={`/dashboard/processos/novo?id=${p.id}&edit=true`}>
                                      <ArrowRight className="h-4 w-4" />
                                    </a>
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {Object.keys(stats.groupedByAnalyst).length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
              <AlertCircle className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">Nenhum processo encontrado para gerar o relatório detalhado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
