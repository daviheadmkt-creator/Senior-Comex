import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function CertificadoOrigemPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Controle de Certificados de Origem</CardTitle>
                <CardDescription>
                Gerencie e emita seus certificados de origem.
                </CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Certificado
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>Página em construção para gestão de Certificados de Origem.</p>
      </CardContent>
    </Card>
  );
}
