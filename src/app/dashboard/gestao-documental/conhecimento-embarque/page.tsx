import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ConhecimentoEmbarquePage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Controle de Conhecimentos de Embarque</CardTitle>
                <CardDescription>
                Gerencie seus BLs (Bill of Lading) e AWBs (Air Waybill).
                </CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Documento
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>Página em construção para gestão de Conhecimentos de Embarque.</p>
      </CardContent>
    </Card>
  );
}
