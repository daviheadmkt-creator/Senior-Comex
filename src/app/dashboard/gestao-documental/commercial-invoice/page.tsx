import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function GestaoCommercialInvoicePage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Controle de Commercial Invoices</CardTitle>
                <CardDescription>
                Gerencie e emita suas faturas comerciais.
                </CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Commercial Invoice
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>Página em construção para gestão de Commercial Invoices.</p>
      </CardContent>
    </Card>
  );
}
