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
  LineChart,
  Line
} from 'recharts';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['#4DB6AC', '#80CBC4', '#26A69A', '#00897B', '#00796B', '#00695C'];

export default function RelatoriosPage() {
  const firestore = useFirestore();
  
  const processosCollection = useMemoFirebase(() => firestore ? collection(firestore, 'processos') : null, [firestore]);
  const { data: processos, isLoading } = useCollection(processosCollection);

  const stats = useMemo(() => {
    if (!processos) return { perAnalyst: [], perPort: [], volumeOverTime: [] };

    // Performance por Analista
    const analystMap: Record<string, number> = {};
    const portMap: Record<string, number> = {};
    const monthMap: Record<string, number> = {};

    processos.forEach(p => {
      // Por Analista
      const analyst = p.analistaNome || 'N/A';
      analystMap[analyst] = (analystMap[analyst] || 0) + 1;

      // Por Porto
      const port = p.portoEmbarqueNome || 'N/A';
      portMap[port] = (portMap[port] || 0) + 1;

      // Volume por Tempo (Mês)
      if (p.data_nomeacao) {
        const date = new Date(p.data_nomeacao);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthMap[monthYear] = (monthMap[monthYear] || 0) + 1;
      }
    });

    const perAnalyst = Object.entries(analystMap).map(([name, value]) => ({ name, value }));
    const perPort = Object.entries(portMap).map(([name, value]) => ({ name, value }));
    const volumeOverTime = Object.entries(monthMap).map(([name, value]) => ({ name, value }));

    return { perAnalyst, perPort, volumeOverTime };
  }, [processos]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios Gerenciais</h1>
          <p className="text-muted-foreground">Análise de volume, performance e fluxos operacionais.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" /> Exportar Dados
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Performance por Analista */}
        <Card>
          <CardHeader>
            <CardTitle>Processos por Analista</CardTitle>
            <CardDescription>Distribuição de carga de trabalho por membro da equipe.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.perAnalyst}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  cursor={{ fill: 'rgba(77, 182, 172, 0.1)' }}
                />
                <Bar dataKey="value" fill="#4DB6AC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Porto */}
        <Card>
          <CardHeader>
            <CardTitle>Volume por Porto de Embarque</CardTitle>
            <CardDescription>Principais vias de saída das mercadorias.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.perPort}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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

        {/* Volume ao Longo do Tempo */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Evolução de Nomeações</CardTitle>
            <CardDescription>Histórico mensal de novos processos iniciados.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.volumeOverTime}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4DB6AC" strokeWidth={2} dot={{ fill: '#4DB6AC' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
