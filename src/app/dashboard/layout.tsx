
'use client';
import { useEffect, useMemo } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Package,
  Anchor,
  UserCog,
  Ship,
  FileText,
  Settings,
  DollarSign,
  LineChart,
  Target,
  FileBarChart,
  ClipboardList,
  Building,
  Sailboat,
  Contact,
  HardHat,
  PackageCheck,
  TrendingUp,
  CreditCard,
  Globe,
  Warehouse,
  Loader2
} from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: currentUserData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const isUserAdmin = useMemo(() => {
    return currentUserData?.funcao === 'Administrador';
  }, [currentUserData]);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isUserDocLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2 pr-4">
             <div className="text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="200" height="40" viewBox="0 0 200 40">
                <path fill="currentColor" d="M20 40C9 40 0 31 0 20S9 0 20 0s20 9 20 20-9 20-20 20zm-4.3-7.7L25 22.6a1.4 1.4 0 000-2.3L15.7 10a1.4 1.4 0 00-2.3 0L3.7 20l9.7 7.7a1.4 1.4 0 002.3 0zM24.3 30L15 22.6a1.4 1.4 0 010-2.3L24.3 10a1.4 1.4 0 012.3 0L36.3 20l-9.7 7.7a1.4 1.4 0 01-2.3 0z"/>
                <text x="50" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="currentColor">senior</text>
                <text x="50" y="36" fontFamily="sans-serif" fontSize="9" fill="currentColor">Assessoria em Comércio Exterior Ltda</text>
              </svg>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard" isActive>
                    <LayoutDashboard />
                    <span>Visão Geral</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/processos">
                    <PackageCheck />
                    <span>Gestão de Processos</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton>
                    <ClipboardList />
                    <span>Cadastros</span>
                </SidebarMenuButton>
                 <SidebarMenuSub>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/dashboard/cadastros/parceiros">
                            Parceiros
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    {isUserAdmin && (
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="/dashboard/cadastros/usuarios">
                                Usuários
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    )}
                </SidebarMenuSub>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton>
                    <DollarSign />
                    <span>Financeiro</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/dashboard/financeiro/lancamentos">
                            Lançamentos
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                     <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/dashboard/financeiro/projecao-caixa">
                            Fluxo de Caixa
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                     <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/dashboard/financeiro/kpis">
                            KPIs
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/dashboard/financeiro/relatorios">
                            Relatórios
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <ClipboardList />
                    <span>Dados de Referência</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/dashboard/dados-referencia/produtos">
                            Produtos
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                     <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/dashboard/dados-referencia/portos">
                            Portos
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                     <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/dashboard/dados-referencia/terminais">
                            Terminais
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton href="/dashboard/configuracoes">
                    <Settings />
                    <span>Configurações</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton href="/portal/embarques">
                    <Globe />
                    <span>Portal do Cliente</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-6">
           <SidebarTrigger />
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8 bg-background" />
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center gap-4">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
