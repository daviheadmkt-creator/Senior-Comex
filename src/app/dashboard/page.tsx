import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  WalletCards,
  UserPlus,
  BadgeDollarSign,
  BadgeX,
} from 'lucide-react';
import { SalesChart } from '@/components/sales-chart';
import { UsersChart } from '@/components/users-chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const users = [
  {
    name: 'Dianne Russell',
    email: 'nevaeh.simmons@example.com',
    plan: 'Free',
    status: 'Active',
    date: '27 Mar 2024',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    name: 'Wade Warren',
    email: 'wade.warren@example.com',
    plan: 'Basic',
    status: 'Active',
    date: '27 Mar 2024',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
  },
  {
    name: 'Albert Flores',
    email: 'albert.flores@example.com',
    plan: 'Standard',
    status: 'Active',
    date: '27 Mar 2024',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
  },
  {
    name: 'Bessie Cooper',
    email: 'bessie.cooper@example.com',
    plan: 'Business',
    status: 'Active',
    date: '27 Mar 2024',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
  },
   {
    name: 'Arlene McCoy',
    email: 'arlene.mccoy@example.com',
    plan: 'Enterprise',
    status: 'Active',
    date: '27 Mar 2024',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
  },
];

const getStatusVariant = (status: string) => {
  if (status === 'Active') return 'success';
  return 'default';
};

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20,000</div>
            <p className="text-xs text-green-500">+5000 Últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Inscrições Totais
            </CardTitle>
            <WalletCards className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,000</div>
            <p className="text-xs text-red-500">-800 Últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários Gratuitos
            </CardTitle>
            <UserPlus className="h-5 w-5 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,000</div>
            <p className="text-xs text-green-500">+200 Últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Renda Total</CardTitle>
            <BadgeDollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42,000</div>
            <p className="text-xs text-green-500">+$20,000 Últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
            <BadgeX className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$30,000</div>
            <p className="text-xs text-red-500">+$5,000 Últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estatísticas de Vendas</CardTitle>
            <CardDescription>$27,200 <span className="text-green-500 text-xs">10%</span> +$7633 por Dia</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral dos Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
            <CardTitle>Últimos Registrados</CardTitle>
            <CardDescription>Aqui está a lista dos últimos usuários registrados.</CardDescription>
            </div>
             <Button variant="link">Ver Todos</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuários</TableHead>
                <TableHead className="hidden md:table-cell">Registrado em</TableHead>
                <TableHead className="hidden lg:table-cell">Plano</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.date}</TableCell>
                  <TableCell className="hidden lg:table-cell">{user.plan}</TableCell>
                  <TableCell>
                     <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className={user.status === 'Active' ? 'bg-green-100 text-green-800' : ''}>
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
