import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function DuePage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Controle de DU-E</CardTitle>
                <CardDescription>
                Gerencie suas Declarações Únicas de Exportação.
                </CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova DU-E
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>Página em construção para gestão de DU-E.</p>
      </CardContent>
    </Card>
  );
}
