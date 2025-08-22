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
             <div className="text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="140" height="40" viewBox="0 0 351.34 77.25">
                <path d="M42.7,5.55A38.63,38.63,0,0,1,76.5,52.35l-11-3.3a26,26,0,1,0-26,26l3.3,11A38.63,38.63,0,0,1,42.7,5.55Z" fill="currentColor"/>
                <path d="M37.35,31.12,4.8,42.7a26,26,0,0,0,32.55,11.55l-11-20.8A26,26,0,0,0,37.35,31.12Z" fill="currentColor"/>
                <path d="M48.1,25.72,27.3,14.17a26,26,0,0,0-14.8,36l22.3-7.55A26,26,0,0,0,48.1,25.72Z" fill="currentColor"/>
                <text x="85" y="60" fontFamily="sans-serif" fontSize="60" fill="currentColor">
                  senior
                </text>
                <text x="135" y="75" fontFamily="sans-serif" fontSize="14" fill="currentColor">
                  Assessoria em Comércio Exterior Ltda
                </text>
              </svg>
            </div>
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
