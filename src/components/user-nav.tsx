
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
import { LogOut, User, Settings, Bell, CheckCircle } from "lucide-react"
import { ThemeToggle } from "./theme-toggle";
import { Badge } from "./ui/badge";


const notifications = [
    {
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        title: 'Parabéns!',
        description: 'Seu perfil foi verificado.',
        time: '23 min atrás',
    },
    {
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
        name: 'Ronald Richards',
        description: 'Convidou você para o projeto X.',
        time: '23 min atrás',
    },
    {
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
        name: 'Arlene McCoy',
        description: 'Convidou você para prototipar.',
        time: '23 min atrás',
    },
    {
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c',
        name: 'Annette Black',
        description: 'Convidou você para prototipar.',
        time: '23 min atrás',
    },
    {
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        name: 'Darlene Robertson',
        description: 'Convidou você para prototipar.',
        time: '23 min atrás',
    }
]

export function UserNav() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="flex items-center gap-2">
        <ThemeToggle />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                     <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                     </span>
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Notificações</span>
                        <Badge variant="secondary">5</Badge>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification, index) => (
                         <DropdownMenuItem key={index} className="flex items-start gap-3 p-2">
                             {notification.icon ? (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                    {notification.icon}
                                </div>
                             ) : (
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={notification.avatar} />
                                    <AvatarFallback>{notification.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                             )}
                            <div className="flex-1">
                                <p className="font-semibold">{notification.title || notification.name}</p>
                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center">
                    Ver Todas as Notificações
                </DropdownMenuItem>
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
            <Link href="/dashboard/configuracoes" passHref>
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
