'use client';
import { useEffect, useMemo, useState } from 'react';
import { UserNav } from '@/components/user-nav';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
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
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [logo, setLogo] = useState<string | null>(null);

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
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8 flex-1">
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

            <div className="hidden lg:flex items-center">
                <Menubar className="border-none bg-transparent shadow-none">
                    <MenubarMenu>
                        <Link href="/dashboard" passHref legacyBehavior>
                            <MenubarTrigger className="cursor-pointer font-semibold hover:bg-accent/50">Dashboard</MenubarTrigger>
                        </Link>
                    </MenubarMenu>
                    <MenubarMenu>
                        <Link href="/dashboard/processos" passHref legacyBehavior>
                            <MenubarTrigger className="cursor-pointer font-semibold hover:bg-accent/50">Processos</MenubarTrigger>
                        </Link>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger className="font-semibold hover:bg-accent/50 cursor-pointer">Cadastros</MenubarTrigger>
                        <MenubarContent>
                            <Link href="/dashboard/cadastros/parceiros" passHref legacyBehavior>
                                <MenubarItem className="cursor-pointer">Parceiros</MenubarItem>
                            </Link>
                            {isUserAdmin && (
                                <>
                                    <MenubarSeparator />
                                    <Link href="/dashboard/cadastros/usuarios" passHref legacyBehavior>
                                        <MenubarItem className="cursor-pointer">Usuários</MenubarItem>
                                    </Link>
                                </>
                            )}
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger className="font-semibold hover:bg-accent/50 cursor-pointer">Referência</MenubarTrigger>
                        <MenubarContent>
                            <Link href="/dashboard/dados-referencia/produtos" passHref legacyBehavior>
                                <MenubarItem className="cursor-pointer">Produtos</MenubarItem>
                            </Link>
                            <Link href="/dashboard/dados-referencia/portos" passHref legacyBehavior>
                                <MenubarItem className="cursor-pointer">Portos</MenubarItem>
                            </Link>
                            <Link href="/dashboard/dados-referencia/terminais" passHref legacyBehavior>
                                <MenubarItem className="cursor-pointer">Terminais</MenubarItem>
                            </Link>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <Link href="/dashboard/configuracoes" passHref legacyBehavior>
                            <MenubarTrigger className="cursor-pointer font-semibold hover:bg-accent/50">Configurações</MenubarTrigger>
                        </Link>
                    </MenubarMenu>
                </Menubar>
            </div>
          </div>

          <div className="flex items-center gap-4">
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
