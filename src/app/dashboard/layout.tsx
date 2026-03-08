'use client';
import { useEffect, useMemo, useState } from 'react';
import { UserNav } from '@/components/user-nav';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import { SearchProvider } from '@/components/search-provider';
import Link from 'next/link';
import { 
  Loader2, 
  Menu as MenuIcon, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  Package, 
  Anchor, 
  Container,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();
  const [logo, setLogo] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedLogo = localStorage.getItem('system_logo');
    if (savedLogo) {
        setLogo(savedLogo);
    }
  }, []);

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
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const NavLink = ({ href, icon: Icon, children, exact = false }: { href: string, icon: any, children: React.ReactNode, exact?: boolean }) => {
    const active = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Link 
        href={href} 
        onClick={() => setIsMenuOpen(false)}
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-lg transition-all group",
          active 
            ? "bg-primary text-primary-foreground shadow-md" 
            : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("h-5 w-5", active ? "text-primary-foreground" : "group-hover:text-primary")} />
          <span className="font-medium">{children}</span>
        </div>
        <ChevronRight className={cn("h-4 w-4 opacity-0 transition-all", active ? "opacity-100" : "group-hover:opacity-50")} />
      </Link>
    );
  };

  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 border-primary/20 hover:bg-primary/5">
                        <MenuIcon className="h-5 w-5 text-primary" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
                    <SheetHeader className="p-6 text-left border-b bg-primary/5">
                        <SheetTitle className="flex items-center gap-2 text-primary font-bold">
                           <LayoutDashboard className="h-5 w-5" />
                           Menu SeniorComex
                        </SheetTitle>
                    </SheetHeader>
                    
                    <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                        {/* Principal */}
                        <div className="space-y-1">
                            <div className="px-4 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Geral</div>
                            <NavLink href="/dashboard" icon={LayoutDashboard} exact>Dashboard</NavLink>
                            <NavLink href="/dashboard/processos" icon={FileText}>Processos</NavLink>
                            <NavLink href="/dashboard/relatorios" icon={BarChart3}>Relatórios</NavLink>
                        </div>

                        <Separator className="mx-4 opacity-50" />

                        {/* Gestão */}
                        <div className="space-y-1">
                            <div className="px-4 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gestão</div>
                            <NavLink href="/dashboard/cadastros/parceiros" icon={Users}>Parceiros</NavLink>
                            {isUserAdmin && (
                                <NavLink href="/dashboard/cadastros/usuarios" icon={Users}>
                                    <span className="text-blue-600 font-bold">Usuários</span>
                                </NavLink>
                            )}
                        </div>

                        <Separator className="mx-4 opacity-50" />

                        {/* Referência */}
                        <div className="space-y-1">
                            <div className="px-4 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Dados Técnicos</div>
                            <NavLink href="/dashboard/dados-referencia/produtos" icon={Package}>Produtos</NavLink>
                            <NavLink href="/dashboard/dados-referencia/portos" icon={Anchor}>Portos</NavLink>
                            <NavLink href="/dashboard/dados-referencia/terminais" icon={Container}>Terminais</NavLink>
                        </div>

                        <Separator className="mx-4 opacity-50" />

                        {/* Configs */}
                        <div className="space-y-1 pb-10">
                            <div className="px-4 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sistema</div>
                            <NavLink href="/dashboard/configuracoes" icon={Settings}>Configurações</NavLink>
                        </div>
                    </div>

                    <div className="p-4 border-t bg-muted/20">
                        <p className="text-[10px] text-center text-muted-foreground font-medium">SeniorComex v1.0.0</p>
                    </div>
                </SheetContent>
            </Sheet>

            <Link href="/dashboard" className="flex items-center shrink-0">
               {logo ? (
                   <Image src={logo} alt="System Logo" width={140} height={28} className="object-contain h-7" />
               ) : (
                  <div className="text-primary h-10 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" className="h-full w-auto">
                          <path fill="currentColor" d="M20 40C9 40 0 31 0 20S9 0 20 0s20 9 20 20-9 20-20 20zm-4.3-7.7L25 22.6a1.4 1.4 0 000-2.3L15.7 10a1.4 1.4 0 00-2.3 0L3.7 20l9.7 7.7a1.4 1.4 0 002.3 0zM24.3 30L15 22.6a1.4 1.4 0 010-2.3L24.3 10a1.4 1.4 0 012.3 0L36.3 20l-9.7 7.7a1.4 1.4 0 01-2.3 0z"/>
                          <text x="50" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="currentColor">senior</text>
                          <text x="50" y="36" fontFamily="sans-serif" fontSize="9" fill="currentColor">Assessoria em Comércio Exterior Ltda</text>
                      </svg>
                  </div>
               )}
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background/50">
          {children}
        </main>
      </div>
    </SearchProvider>
  );
}
