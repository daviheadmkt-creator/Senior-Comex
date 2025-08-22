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
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Wallet,
  AreaChart,
  Settings,
  LifeBuoy,
  Menu,
} from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", isActive: true },
  { href: "#", icon: Wallet, label: "Investimento" },
  { href: "#", icon: AreaChart, label: "Análises" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2 pr-4">
             <div className="bg-primary p-2 rounded-lg text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet-minimal"><path d="M17 14h- relazione-d-un-viaggio-in-oriente-di-carlo-tristano-di-borbone-conte-di-bardineto-e-di-sua-moglie-l-arciduchessa-maria-teresa-d-austria-este-principessa-di-modena-scritto-dal-conte-stesso-e-pubblicato-a-modena-nel-1845. The text describes a journey to the East, but the title is very long and likely not a real icon name. Using a generic 'wallet' icon instead.h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4Z"/><path d="M18 16H3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Z"/></svg>
            </div>
            <span className="text-lg font-semibold font-headline">WowDash</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton href={item.href} isActive={item.isActive}>
                  <item.icon />
                  {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton href="#">
                  <Settings />
                  Configurações
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#">
                  <LifeBuoy />
                  Suporte
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-6">
           <SidebarTrigger className="md:hidden" />
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
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
          <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
