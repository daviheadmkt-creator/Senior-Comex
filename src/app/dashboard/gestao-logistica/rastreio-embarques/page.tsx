
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Loader2, MapPin, Anchor, Plane, Truck, Warehouse, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const trackingData = {
  id: 'MSCU1234567',
  status: 'Em Trânsito',
  origin: 'Porto de Santos, BR',
  destination: 'Port of New York, US',
  estimatedDelivery: '10/08/2024',
  events: [
    { date: '28/07/2024', time: '14:00', location: 'Port of New York, US', description: 'Carga Desembarcada', icon: Anchor, status: 'complete' },
    { date: '25/07/2024', time: '18:30', location: 'Oceano Atlântico', description: 'Em Trânsito', icon: MapPin, status: 'active' },
    { date: '22/07/2024', time: '09:00', location: 'Porto de Santos, BR', description: 'Embarque Realizado', icon: Plane, status: 'complete' },
    { date: '21/07/2024', time: '16:00', location: 'Terminal de Contêineres, Santos, BR', description: 'Contêiner Chegou ao Porto', icon: Warehouse, status: 'complete' },
    { date: '20/07/2024', time: '11:00', location: 'Centro de Distribuição, São Paulo, BR', description: 'Pedido Coletado', icon: Truck, status: 'complete' },
  ]
};

export default function RastreioEmbarquesPage() {
  const [trackingId, setTrackingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<typeof trackingData | null>(null);

  const handleSearch = () => {
    if (!trackingId) return;
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(trackingData);
      setIsLoading(false);
    }, 1500);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
        case 'Em Trânsito':
            return 'bg-blue-100 text-blue-800';
        case 'Entregue':
            return 'bg-green-100 text-green-800';
        case 'Aguardando Embarque':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return '';
    }
}

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-md">
                <MapPin className="h-6 w-6" />
            </div>
            <div>
                <CardTitle>Rastreio de Embarques</CardTitle>
                <CardDescription>
                Insira o código para acompanhar o status de seu embarque em tempo real.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="flex w-full max-w-md items-end gap-2">
                <div className="flex-grow space-y-2">
                    <Label htmlFor="tracking-id">Nº do Contêiner / BL / AWB</Label>
                    <Input 
                        id="tracking-id" 
                        placeholder="Ex: MSCU1234567" 
                        value={trackingId} 
                        onChange={(e) => setTrackingId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                   {isLoading ? (
                       <Loader2 className="h-4 w-4 animate-spin" />
                   ) : (
                       <Search className="h-4 w-4" />
                   )}
                </Button>
            </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {result && (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Resultado para: {result.id}</CardTitle>
                        <CardDescription>
                            De <span className="font-medium text-foreground">{result.origin}</span> para <span className="font-medium text-foreground">{result.destination}</span>
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <Label className="text-xs">Status Atual</Label>
                        <Badge className={getStatusClass(result.status)}>{result.status}</Badge>
                         <p className="text-xs text-muted-foreground mt-1">
                            Previsão de Entrega: {result.estimatedDelivery}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative pl-6">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
                    <ul className="space-y-8">
                        {result.events.map((event, index) => (
                             <li key={index} className="flex items-start gap-4">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${event.status === 'active' ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                                    <event.icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 mt-1.5">
                                    <h4 className="font-semibold">{event.description}</h4>
                                    <p className="text-sm text-muted-foreground">{event.location}</p>
                                    <time className="text-xs text-muted-foreground">{event.date} às {event.time}</time>
                                </div>
                             </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
