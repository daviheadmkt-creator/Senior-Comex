'use client';

import { useState } from 'react';
import { summarizeOperationalReport } from '@/ai/flows/summarize-operational-report';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const placeholderReport = `Relatório Operacional: Q2 2024

Data: 15 de julho de 2024
Preparado por: Equipe de Operações

Resumo Executivo:
O segundo trimestre de 2024 mostrou um forte desempenho em nossa divisão de logística, com um aumento de 15% nas entregas pontuais em comparação com o Q1. No entanto, o departamento financeiro enfrentou desafios com as flutuações cambiais, impactando a lucratividade geral em 5%. A importação de soja do Brasil aumentou 20%, enquanto as exportações de milho para o México permaneceram estáveis.

Principais Atividades:
1.  Logística: Implementado novo sistema de rastreamento, reduzindo a perda de pacotes em 8%. O tempo médio de trânsito foi reduzido em 12 horas para as principais rotas.
2.  Finanças: As estratégias de hedge foram parcialmente bem-sucedidas contra a força do dólar. Uma nova auditoria revelou lacunas de conformidade nas declarações alfandegárias para remessas de trigo canadense.
3.  Operações: Nova parceria com um fornecedor de café colombiano garantida. As negociações estão em andamento para expandir as exportações de cana-de-açúcar para a Índia. Duas grandes remessas foram suspensas devido a problemas de documentação.

Desafios:
-   O congestionamento portuário na China continua sendo um grande gargalo.
-   O aumento dos custos de combustível está elevando as despesas operacionais.
-   Mudanças regulatórias na UE exigem protocolos de conformidade atualizados.

Perspectivas para o Q3 2024:
O foco será na mitigação de riscos financeiros e na resolução de gargalos logísticos. Projetamos um crescimento constante de 5-7% no volume comercial geral, impulsionado por novas parcerias.
`;

export default function AISummarizer() {
  const [report, setReport] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!report.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo do relatório não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeOperationalReport({ report });
      setSummary(result.summary);
    } catch (error) {
      console.error('Erro ao resumir o relatório:', error);
      toast({
        title: "Falha ao Resumir",
        description: "Ocorreu um erro ao resumir o relatório. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Textarea
          placeholder="Cole seu relatório operacional aqui ou carregue um exemplo para testar."
          value={report}
          onChange={(e) => setReport(e.target.value)}
          className="min-h-[300px] text-sm"
        />
        <div className="flex gap-2">
            <Button onClick={handleSummarize} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="mr-2 h-4 w-4" />
            )}
            Resumir
            </Button>
            <Button variant="outline" onClick={() => setReport(placeholderReport)} disabled={isLoading}>
                Carregar Exemplo
            </Button>
        </div>
      </div>
      <div>
        <Card className="min-h-[300px] h-full bg-secondary/30 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Resumo da IA</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : summary ? (
              <div className="text-sm text-foreground/90 space-y-4">
                <p>{summary}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-center">
                Seu resumo gerado por IA aparecerá aqui.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
