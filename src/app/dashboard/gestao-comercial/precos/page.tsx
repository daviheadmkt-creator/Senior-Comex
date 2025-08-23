import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function PrecosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Preços</CardTitle>
        <CardDescription>
          Gerencie os preços dos produtos em diferentes moedas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Funcionalidades para gestão de preços em diferentes moedas estarão aqui.</p>
      </CardContent>
    </Card>
  );
}
