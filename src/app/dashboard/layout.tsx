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
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Wallet,
  AreaChart,
  Settings,
  LifeBuoy,
  Menu,
  Database,
  Users,
  Building,
  Box,
  Globe,
  Building2,
  Briefcase,
  FilePlus2,
  FileText,
  ClipboardList,
  DollarSign,
  FileArchive,
  FileBox,
  FileCheck2,
  Award,
  FileUp,
  ShieldCheck,
  BookText,
  Calculator,
  Repeat,
  Handshake,
  Warehouse,
  Truck,
  Package,
  MapPin,
  FileSignature,
  Landmark,
  ReceiptText,
  CircleDollarSign,
  Files,
  LineChart,
  ShieldBan,
  CalendarCheck,
  History,
  ClipboardCheck,
} from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';


const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "#", icon: Wallet, label: "Investimento" },
  { href: "#", icon: AreaChart, label: "Análises" },
];

const cadastroItems = [
    { href: "/dashboard/cadastros/empresa", icon: Building2, label: "Empresa" },
    { href: "/dashboard/cadastros/clientes", icon: Users, label: "Clientes Internacionais" },
    { href: "/dashboard/cadastros/fornecedores", icon: Building, label: "Fornecedor" },
    { href: "/dashboard/cadastros/produtos", icon: Box, label: "Produtos" },
    { href: "/dashboard/cadastros/paises", icon: Globe, label: "Países e Moedas" },
];

const gestaoComercialItems = [
    { href: "/dashboard/gestao-comercial/proforma-invoice", icon: FilePlus2, label: "Proforma Invoice" },
    { href: "/dashboard/gestao-comercial/commercial-invoice", icon: FileText, label: "Commercial Invoice" },
    { href: "/dashboard/gestao-comercial/pedidos", icon: ClipboardList, label: "Controle de Pedidos" },
    { href: "/dashboard/gestao-comercial/precos", icon: DollarSign, label: "Gestão de Preços" },
]

const gestaoDocumentalItems = [
    { href: "/dashboard/gestao-documental/commercial-invoice", icon: FileText, label: "Commercial Invoice" },
    { href: "/dashboard/gestao-documental/packing-list", icon: FileBox, label: "Packing List" },
    { href: "/dashboard/gestao-documental/conhecimento-embarque", icon: FileCheck2, label: "Conhecimento de Embarque" },
    { href: "/dashboard/gestao-documental/certificado-origem", icon: Award, label: "Certificado de Origem" },
    { href: "/dashboard/gestao-documental/due", icon: FileUp, label: "Declaração Única (DU-E)" },
]

const gestaoAduaneiraItems = [
    { href: "/dashboard/gestao-aduaneira/classificacao-fiscal", icon: BookText, label: "Classificação Fiscal" },
    { href: "/dashboard/gestao-aduaneira/calculo-impostos", icon: Calculator, label: "Cálculo de Impostos" },
    { href: "/dashboard/gestao-aduaneira/regimes-aduaneiros", icon: Repeat, label: "Regimes Aduaneiros" },
    { href: "/dashboard/gestao-aduaneira/integracao-despachantes", icon: Handshake, label: "Integração com Despachantes" },
]

const gestaoLogisticaItems = [
    { href: "/dashboard/gestao-logistica/controle-fretes", icon: Truck, label: "Controle de Fretes" },
    { href: "/dashboard/gestao-logistica/gestao-containers", icon: Package, label: "Gestão de Contêineres" },
    { href: "/dashboard/gestao-logistica/rastreio-embarques", icon: MapPin, label: "Rastreio de Embarques" },
    { href: "/dashboard/gestao-logistica/instrucoes-embarque", icon: FileSignature, label: "Instruções de Embarque" },
]

const gestaoFinanceiraItems = [
    { href: "/dashboard/gestao-financeira/controle-cambio", icon: Landmark, label: "Controle de Câmbio" },
    { href: "/dashboard/gestao-financeira/faturas-boletos", icon: ReceiptText, label: "Faturas e Boletos" },
    { href: "/dashboard/gestao-financeira/controle-recebiveis", icon: CircleDollarSign, label: "Controle de Recebíveis" },
    { href: "/dashboard/gestao-financeira/gestao-credito", icon: Files, label: "Gestão de Crédito" },
    { href: "/dashboard/gestao-financeira/relatorios-margem", icon: LineChart, label: "Relatórios de Margem" },
]

const complianceItems = [
    { href: "/dashboard/compliance-auditoria/validacao-clientes-paises", icon: ShieldBan, label: "Validação de Clientes" },
    { href: "/dashboard/compliance-auditoria/controle-prazos", icon: CalendarCheck, label: "Controle de Prazos" },
    { href: "/dashboard/compliance-auditoria/registro-auditoria", icon: History, label: "Registro de Auditoria" },
]

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
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label} className="my-1">
                <SidebarMenuButton href={item.href} isActive={item.href === '/dashboard'}>
                  <item.icon />
                  {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <Collapsible>
                <SidebarMenuItem  className="my-1">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            <Database />
                            Cadastros
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                </SidebarMenuItem>
                 <CollapsibleContent>
                    <SidebarMenuSub>
                    {cadastroItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuSubButton href={item.href}>
                                <item.icon />
                                {item.label}
                            </SidebarMenuSubButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenuSub>
                 </CollapsibleContent>
            </Collapsible>
             <Collapsible>
                <SidebarMenuItem  className="my-1">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            <Briefcase />
                            Gestão Comercial
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                </SidebarMenuItem>
                 <CollapsibleContent>
                    <SidebarMenuSub>
                    {gestaoComercialItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuSubButton href={item.href}>
                                <item.icon />
                                {item.label}
                            </SidebarMenuSubButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenuSub>
                 </CollapsibleContent>
            </Collapsible>
             <Collapsible>
                <SidebarMenuItem  className="my-1">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            <FileArchive />
                            Gestão Documental
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                </SidebarMenuItem>
                 <CollapsibleContent>
                    <SidebarMenuSub>
                    {gestaoDocumentalItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuSubButton href={item.href}>
                                <item.icon />
                                {item.label}
                            </SidebarMenuSubButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenuSub>
                 </CollapsibleContent>
            </Collapsible>
            <Collapsible>
                <SidebarMenuItem  className="my-1">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            <ShieldCheck />
                            Gestão Aduaneira
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                </SidebarMenuItem>
                 <CollapsibleContent>
                    <SidebarMenuSub>
                    {gestaoAduaneiraItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuSubButton href={item.href}>
                                <item.icon />
                                {item.label}
                            </SidebarMenuSubButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenuSub>
                 </CollapsibleContent>
            </Collapsible>
            <Collapsible>
                <SidebarMenuItem  className="my-1">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            <Warehouse />
                            Gestão Logística
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                </SidebarMenuItem>
                 <CollapsibleContent>
                    <SidebarMenuSub>
                    {gestaoLogisticaItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuSubButton href={item.href}>
                                <item.icon />
                                {item.label}
                            </SidebarMenuSubButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenuSub>
                 </CollapsibleContent>
            </Collapsible>
            <Collapsible>
                <SidebarMenuItem  className="my-1">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            <DollarSign />
                            Gestão Financeira
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                </SidebarMenuItem>
                 <CollapsibleContent>
                    <SidebarMenuSub>
                    {gestaoFinanceiraItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuSubButton href={item.href}>
                                <item.icon />
                                {item.label}
                            </SidebarMenuSubButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenuSub>
                 </CollapsibleContent>
            </Collapsible>
             <Collapsible>
                <SidebarMenuItem  className="my-1">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            <ClipboardCheck />
                            Compliance e Auditoria
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                </SidebarMenuItem>
                 <CollapsibleContent>
                    <SidebarMenuSub>
                    {complianceItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuSubButton href={item.href}>
                                <item.icon />
                                {item.label}
                            </SidebarMenuSubButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenuSub>
                 </CollapsibleContent>
            </Collapsible>
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
