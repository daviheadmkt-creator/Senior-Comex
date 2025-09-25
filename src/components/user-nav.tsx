
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings, Bell, CheckCircle, CalendarClock, FileWarning, AlertTriangle } from "lucide-react"
import { ThemeToggle } from "./theme-toggle";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";


const notifications = [
    {
        id: 1,
        icon: <CalendarClock className="h-5 w-5 text-yellow-600" />,
        title: "Deadline Próximo",
        description: "Deadline de Draft para o processo SEN2378-26 se aproxima (2 dias).",
        time: 'Agora',
        link: "/dashboard/processos"
    },
    {
        id: 2,
        icon: <FileWarning className="h-5 w-5 text-orange-500" />,
        title: "Documento Faltante",
        description: "Faltando Packing List para o processo SEN2378-26.",
        time: 'Agora',
        link: "/dashboard/processos"
    },
    {
        id: 3,
        icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
        title: "Processo Atrasado",
        description: "Processo SEN2378-28 com status 'Atrasado'.",
        time: 'Agora',
        link: "/dashboard/processos"
    },
]

export function UserNav() {
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setIsNotificationOpen(true);
    }
  }, []);

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="flex items-center gap-2">
        <ThemeToggle />
         <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                     {notifications.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                     )}
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Notificações</span>
                         {notifications.length > 0 && <Badge variant="destructive">{notifications.length}</Badge>}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                         <Link href={notification.link || '#'} key={notification.id} passHref>
                            <DropdownMenuItem className="flex items-start gap-3 p-2 cursor-pointer">
                                {notification.icon ? (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        {notification.icon}
                                    </div>
                                ) : (
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={''} />
                                        <AvatarFallback>{notification.title?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="flex-1">
                                    <p className="font-semibold">{notification.title}</p>
                                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                                </div>
                            </DropdownMenuItem>
                        </Link>
                    ))}
                     {notifications.length === 0 && (
                        <div className="text-center text-muted-foreground p-4">
                            Nenhuma notificação nova.
                        </div>
                    )}
                </div>
                <DropdownMenuSeparator />
                 <Link href="/dashboard" passHref>
                    <DropdownMenuItem className="justify-center">
                        Ver Todos os Alertas
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@user" />
              <AvatarFallback>OP</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Operador</p>
              <p className="text-xs leading-none text-muted-foreground">
                operador@senior.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/dashboard/perfil" passHref>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard/configuracoes" passHref>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
