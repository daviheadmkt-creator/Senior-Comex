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
  Warehouse,
  FileText,
  DollarSign,
  Shield,
  TrendingUp,
  Settings,
  LifeBuoy,
} from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", isActive: true },
  { href: "#", icon: FileText, label: "Operations" },
  { href: "#", icon: Warehouse, label: "Logistics" },
  { href: "#", icon: DollarSign, label: "Finance" },
  { href: "#", icon: Shield, label: "Admin" },
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
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold font-headline">SeniorComex</span>
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
          <Separator className='mb-2' />
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton href="#">
                  <Settings />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#">
                  <LifeBuoy />
                  Support
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
