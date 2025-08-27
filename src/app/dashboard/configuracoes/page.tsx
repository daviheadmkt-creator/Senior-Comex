
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wallet, Landmark } from 'lucide-react';

const configOptions = [
    {
        title: 'Financeiro',
        description: 'Gerencie categorias, centros de custo e contas.',
        href: '/dashboard/configuracoes/financeiro',
        icon: Wallet,
    },
    {
        title: 'Contas Bancárias',
        description: 'Cadastre contas, caixas e meios de pagamento.',
        href: '/dashboard/configuracoes/contas-bancarias',
        icon: Landmark,
    },
]

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>
              Gerencie as configurações gerais do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {configOptions.map((option) => (
                    <Link href={option.href} key={option.title} passHref>
                        <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer">
                           <div className='flex items-center gap-4'>
                             <option.icon className="h-6 w-6 text-muted-foreground" />
                             <div>
                                <p className="font-semibold">{option.title}</p>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                           </div>
                           <Button variant="ghost" size="icon">
                             <ArrowRight className="h-4 w-4" />
                           </Button>
                        </div>
                    </Link>
                ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
