
"use client";

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
import { LogOut, User, Settings, Bell, MessageSquare, Check } from "lucide-react"
import { Badge } from "./ui/badge";

const notifications = [
  {
    type: 'success',
    title: 'Parabéns!',
    description: 'Seu perfil foi verificado.',
    time: '23 min atrás',
  },
  {
    type: 'user',
    name: 'Ronald Richards',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d',
    description: 'Convidou você para o projeto X.',
    time: '23 min atrás',
  },
  {
    type: 'user',
    name: 'Arlene McCoy',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    description: 'Convidou você para prototipar.',
    time: '23 min atrás',
  },
   {
    type: 'user',
    name: 'Annette Black',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    description: 'Convidou você para prototipar.',
    time: '23 min atrás',
  },
   {
    type: 'user',
    name: 'Darlene Robertson',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
    description: 'Convidou você para prototipar.',
    time: '23 min atrás',
  },
];

const messages = [
    {
        name: 'Kathryn Murphy',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026710d',
        message: 'hey! there i’...',
        time: '12:30 PM',
        unread: 8,
    },
    {
        name: 'Kathryn Murphy',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026711d',
        message: 'hey! there i’...',
        time: '12:30 PM',
        unread: 2,
    },
    {
        name: 'Kathryn Murphy',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026712d',
        message: 'hey! there i’...',
        time: '12:30 PM',
        unread: 0,
    },
    {
        name: 'Kathryn Murphy',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026713d',
        message: 'hey! there i’...',
        time: '12:30 PM',
        unread: 0,
    },
    {
        name: 'Kathryn Murphy',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026714d',
        message: 'hey! there i’...',
        time: '12:30 PM',
        unread: 8,
    },
]

export function UserNav() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  const handleViewMessages = () => {
    router.push('/dashboard/chat');
  };

  const totalUnreadMessages = messages.reduce((acc, msg) => acc + (msg.unread > 0 ? 1 : 0), 0);

  return (
    <div className="flex items-center gap-4">
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute top-0 right-0 h-4 w-4 justify-center p-0 bg-destructive text-destructive-foreground rounded-full">5</Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
           <DropdownMenuLabel>
            <div className="flex items-center justify-between">
              <p className="font-bold">Notificações</p>
              <Badge variant="secondary" className="bg-primary/10 text-primary">5</Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="overflow-y-auto max-h-[300px]">
            {notifications.map((notif, index) => (
              <DropdownMenuItem key={index} className="flex items-start gap-3 p-2 cursor-pointer">
                <Avatar className="h-9 w-9">
                  {notif.type === 'success' ? (
                     <div className="flex h-full w-full items-center justify-center rounded-full bg-green-100">
                        <Check className="h-5 w-5 text-green-600" />
                     </div>
                  ) : (
                    <>
                      <AvatarImage src={notif.avatar} alt={notif.name} />
                      <AvatarFallback>{notif.name?.charAt(0)}</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{notif.title || notif.name}</p>
                  <p className="text-xs text-muted-foreground">{notif.description}</p>
                </div>
                <p className="text-xs text-muted-foreground">{notif.time}</p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
           <DropdownMenuSeparator />
           <DropdownMenuItem className="justify-center text-primary hover:!text-primary font-semibold py-2">
            Ver Todas as Notificações
           </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5" />
                {totalUnreadMessages > 0 && (
                  <Badge className="absolute top-0 right-0 h-4 w-4 justify-center p-0 bg-yellow-400 text-black rounded-full">{totalUnreadMessages}</Badge>
                )}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel>
                <div className="flex items-center justify-between">
                    <p className="font-bold">Message</p>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">{totalUnreadMessages > 0 ? totalUnreadMessages.toString().padStart(2, '0') : '0'}</Badge>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
             <DropdownMenuGroup className="overflow-y-auto max-h-[300px]">
                {messages.map((msg, index) => (
                    <DropdownMenuItem key={index} className="flex items-start gap-3 p-2 cursor-pointer">
                        <div className="relative">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={msg.avatar} alt={msg.name} />
                                <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{msg.name}</p>
                            <p className="text-xs text-muted-foreground">{msg.message}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-muted-foreground">{msg.time}</p>
                             {msg.unread > 0 && (
                                <Badge className="mt-1 h-5 w-5 p-0 justify-center rounded-full bg-yellow-400 text-black">{msg.unread}</Badge>
                             )}
                        </div>
                    </DropdownMenuItem>
                ))}
             </DropdownMenuGroup>
             <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewMessages} className="justify-center text-primary hover:!text-primary font-semibold py-2 cursor-pointer">
                Ver Todas as Mensagens
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
                operador@wowdash.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
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
