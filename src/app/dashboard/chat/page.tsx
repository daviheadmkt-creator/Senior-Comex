
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MoreHorizontal,
  Phone,
  Video,
  Paperclip,
  Smile,
  Send,
} from 'lucide-react';

const conversations = [
  {
    name: 'Kathryn Murphy',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026710d',
    message: 'hey! there i’m...',
    time: '12:30 PM',
    unread: 8,
    online: true,
  },
  {
    name: 'James Michael',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    message: 'Sure, I can do that.',
    time: '12:28 PM',
    unread: 0,
    online: true,
  },
  {
    name: 'Russell Lucas',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    message: 'Thanks for the update!',
    time: '12:25 PM',
    unread: 0,
    online: false,
  },
   {
    name: 'Caleb Bradley',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    message: 'Let\'s schedule a call.',
    time: '12:20 PM',
    unread: 2,
    online: true,
  },
   {
    name: 'Bobby Roy',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
    message: 'See you tomorrow.',
    time: '12:15 PM',
    unread: 0,
    online: false,
  },
   {
    name: 'Vincent Liam',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d',
    message: 'Please send the file.',
    time: '12:10 PM',
    unread: 0,
    online: true,
  },
];

const messages = [
  {
    id: 1,
    sender: 'Kathryn Murphy',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026710d',
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.',
    time: '6:30 pm',
    isMe: false,
  },
  {
    id: 2,
    sender: 'Me',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    text: 'It is a long established fact that a reader will',
    time: '6:31 pm',
    isMe: true,
  },
];

export default function ChatPage() {
  return (
    <Card className="h-[calc(100vh-10rem)] flex">
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Chat</h2>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((convo) => (
            <div
              key={convo.name}
              className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer border-b"
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={convo.avatar} alt={convo.name} />
                  <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {convo.online && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card"></span>}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{convo.name}</p>
                <p className="text-sm text-muted-foreground truncate">{convo.message}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{convo.time}</p>
                {convo.unread > 0 && <Badge className="mt-1 h-5 w-5 p-0 justify-center rounded-full bg-yellow-400 text-black">{convo.unread}</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <div className="relative">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026710d" alt="Kathryn Murphy" />
                        <AvatarFallback>KM</AvatarFallback>
                    </Avatar>
                     <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card"></span>
                </div>
                <div>
                    <p className="font-semibold">Kathryn Murphy</p>
                    <p className="text-sm text-green-500">Available</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Phone /></Button>
                <Button variant="ghost" size="icon"><Video /></Button>
                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-3 ${msg.isMe ? 'justify-end' : ''}`}>
                    {!msg.isMe && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.avatar} alt={msg.sender} />
                            <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                    <div className={`max-w-md rounded-lg p-3 ${msg.isMe ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                    </div>
                     {msg.isMe && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.avatar} alt={msg.sender} />
                            <AvatarFallback>Me</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            ))}
        </div>
        <div className="p-4 border-t bg-card">
            <div className="flex items-center gap-2">
                <Input placeholder="Write message" className="flex-1" />
                <Button variant="ghost" size="icon"><Paperclip /></Button>
                <Button variant="ghost" size="icon"><Smile /></Button>
                <Button><Send /></Button>
            </div>
        </div>
      </div>
    </Card>
  );
}
