
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileWarning, CalendarClock } from 'lucide-react';
import Link from 'next/link';

const alerts = [
    { id: 1, icon: <CalendarClock className="h-5 w-5 text-yellow-600" />, message: "Deadline de Draft para o processo SEN2378-26 se aproxima (2 dias).", link: "/dashboard/processos" },
    { id: 2, icon: <FileWarning className="h-5 w-5 text-orange-500" />, message: "Faltando Packing List para o processo SEN2378-26.", link: "/dashboard/processos" },
    { id: 3, icon: <AlertTriangle className="h-5 w-5 text-red-600" />, message: "Processo SEN2378-28 com status 'Atrasado'.", link: "/dashboard/processos" },
]

export default function DashboardPage() {

  return (
    <div className="space-y-6">
         <Card>
            <CardHeader>
                <CardTitle>Alertas e Pendências</CardTitle>
                 <CardDescription>Ações e prazos que requerem sua atenção imediata.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-4">
                    {alerts.map(alert => (
                        <Link href={alert.link} key={alert.id} passHref>
                             <div className="flex items-center p-3 rounded-lg border hover:bg-accent cursor-pointer">
                                <div className="mr-4">
                                    {alert.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{alert.message}</p>
                                </div>
                                <Button variant="secondary" size="sm">Ver Processo</Button>
                            </div>
                        </Link>
                    ))}
                    {alerts.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                            Nenhum alerta no momento.
                        </div>
                    )}
                 </div>
            </CardContent>
        </Card>
    </div>
  );
}
