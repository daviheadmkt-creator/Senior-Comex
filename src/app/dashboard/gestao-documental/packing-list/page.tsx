import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function PackingListPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Controle de Packing Lists</CardTitle>
                <CardDescription>
                Gerencie e emita seus romaneios de carga.
                </CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Packing List
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>Página em construção para gestão de Packing Lists.</p>
      </CardContent>
    </Card>
  );
}
