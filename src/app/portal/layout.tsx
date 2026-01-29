'use client';
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
} from '@/components/ui/sidebar';
import { Ship, FileText, Globe, Loader2 } from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [logo, setLogo] = useState<string | null>(null);
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        const savedLogo = localStorage.getItem('system_logo');
        if (savedLogo) {
            setLogo(savedLogo);
        }
    }, []);

    useEffect(() => {
        if (!isUserLoading && !user) {
          router.push('/portal/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
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
             {logo ? (
                 <Image src={logo} alt="System Logo" width={140} height={28} className="object-contain h-7" />
             ) : (
                <div className="text-primary h-10 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" className="h-full w-auto">
                        <path fill="currentColor" d="M20 40C9 40 0 31 0 20S9 0 20 0s20 9 20 20-9 20-20 20zm-4.3-7.7L25 22.6a1.4 1.4 0 000-2.3L15.7 10a1.4 1.4 0 00-2.3 0L3.7 20l9.7 7.7a1.4 1.4 0 002.3 0zM24.3 30L15 22.6a1.4 1.4 0 010-2.3L24.3 10a1.4 1.4 0 012.3 0L36.3 20l-9.7 7.7a1.4 1.4 0 01-2.3 0z"/>
                        <text x="50" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="currentColor">senior</text>
                        <text x="50" y="36" fontFamily="sans-serif" fontSize="9" fill="currentColor">Portal do Cliente</text>
                    </svg>
                </div>
             )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarGroup>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/portal/embarques" isActive>
                        <Ship />
                        <span>Meus Embarques</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="/portal/documentos">
                        <FileText />
                        <span>Documentos</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-6">
           <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">Portal do Cliente</h1>
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
