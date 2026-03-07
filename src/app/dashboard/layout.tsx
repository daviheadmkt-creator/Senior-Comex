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
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { 
  Loader2, 
  Menu as MenuIcon, 
  LayoutDashboard, 
  FileText, 
  Database, 
  Settings, 
  Users, 
  Package, 
  Anchor, 
  Container 
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Processos', href: '/dashboard/processos', icon: FileText },
  ];

  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-8 flex-1">
            {/* Logo */}
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
                <Menubar className="border-none bg-transparent shadow-none gap-1">
                    <MenubarMenu>
                        <Link href="/dashboard" passHref legacyBehavior>
                            <MenubarTrigger className={cn(
                                "cursor-pointer font-semibold transition-colors",
                                pathname === '/dashboard' ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                            )}>Dashboard</MenubarTrigger>
                        </Link>
                    </MenubarMenu>
                    
                    <MenubarMenu>
                        <Link href="/dashboard/processos" passHref legacyBehavior>
                            <MenubarTrigger className={cn(
                                "cursor-pointer font-semibold transition-colors",
                                pathname.startsWith('/dashboard/processos') ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                            )}>Processos</MenubarTrigger>
                        </Link>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger className={cn(
                            "font-semibold transition-colors cursor-pointer",
                            pathname.includes('/cadastros/') ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                        )}>Cadastros</MenubarTrigger>
                        <MenubarContent>
                            <Link href="/dashboard/cadastros/parceiros" passHref legacyBehavior>
                                <MenubarItem className="cursor-pointer">Parceiros</MenubarItem>
                            </Link>
                            {isUserAdmin && (
                                <>
                                    <MenubarSeparator />
                                    <Link href="/dashboard/cadastros/usuarios" passHref legacyBehavior>
                                        <MenubarItem className="cursor-pointer text-blue-600 font-medium">Usuários do Sistema</MenubarItem>
                                    </Link>
                                </>
                            )}
                        </MenubarContent>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger className={cn(
                            "font-semibold transition-colors cursor-pointer",
                            pathname.includes('/dados-referencia/') ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                        )}>Referência</MenubarTrigger>
                        <MenubarContent>
                            <Link href="/dashboard/dados-referencia/produtos" passHref legacyBehavior>
                                <MenubarItem className="cursor-pointer">Catálogo de Produtos</MenubarItem>
                            </Link>
                            <Link href="/dashboard/dados-referencia/portos" passHref legacyBehavior>
                                <MenubarItem className="cursor-pointer">Portos (Origem/Destino)</MenubarItem>
                            </Link>
                            <Link href="/dashboard/dados-referencia/terminais" passHref legacyBehavior>
                                <MenubarItem className="cursor-pointer">Terminais Portuários</MenubarItem>
                            </Link>
                        </MenubarContent>
                    </MenubarMenu>

                    <MenubarMenu>
                        <Link href="/dashboard/configuracoes" passHref legacyBehavior>
                            <MenubarTrigger className={cn(
                                "cursor-pointer font-semibold transition-colors",
                                pathname.startsWith('/dashboard/configuracoes') ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                            )}>Configurações</MenubarTrigger>
                        </Link>
                    </MenubarMenu>
                </Menubar>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <MenuIcon className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-left">Menu de Navegação</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-2">
                        <Link 
                            href="/dashboard" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                                pathname === '/dashboard' ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                            )}
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link 
                            href="/dashboard/processos" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                                pathname.startsWith('/dashboard/processos') ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                            )}
                        >
                            <FileText className="h-5 w-5" />
                            <span className="font-medium">Gestão de Processos</span>
                        </Link>
                        
                        <div className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cadastros</div>
                        <Link 
                            href="/dashboard/cadastros/parceiros" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-accent transition-colors"
                        >
                            <Users className="h-5 w-5" />
                            <span>Parceiros</span>
                        </Link>
                        {isUserAdmin && (
                            <Link 
                                href="/dashboard/cadastros/usuarios" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-accent transition-colors"
                            >
                                <Users className="h-5 w-5 text-blue-600" />
                                <span>Usuários do Sistema</span>
                            </Link>
                        )}

                        <div className="py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dados de Referência</div>
                        <Link 
                            href="/dashboard/dados-referencia/produtos" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-accent transition-colors"
                        >
                            <Package className="h-5 w-5" />
                            <span>Produtos</span>
                        </Link>
                        <Link 
                            href="/dashboard/dados-referencia/portos" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-accent transition-colors"
                        >
                            <Anchor className="h-5 w-5" />
                            <span>Portos</span>
                        </Link>
                        <Link 
                            href="/dashboard/dados-referencia/terminais" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-accent transition-colors"
                        >
                            <Container className="h-5 w-5" />
                            <span>Terminais</span>
                        </Link>

                        <div className="mt-4 pt-4 border-t">
                            <Link 
                                href="/dashboard/configuracoes" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-accent transition-colors"
                            >
                                <Settings className="h-5 w-5" />
                                <span className="font-medium">Configurações</span>
                            </Link>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

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
