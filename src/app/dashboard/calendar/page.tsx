
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import React from 'react';

const events = [
  { title: 'Design Conference', time: '10:30 PM - 02:30 AM', color: 'bg-orange-500' },
  { title: 'Weekend Festival', time: '10:30 PM - 02:30 AM', color: 'bg-green-500' },
  { title: 'Design Conference', time: '10:30 PM - 02:30 AM', color: 'bg-blue-500' },
  { title: 'Ultra Europe 2019', time: '10:30 PM - 02:30 AM', color: 'bg-orange-500' },
  { title: 'Design Conference', time: '10:30 PM - 02:30 AM', color: 'bg-orange-500' },
];

const calendarDays = [
  // Previous month
  { day: 28, isCurrentMonth: false }, { day: 29, isCurrentMonth: false }, { day: 30, isCurrentMonth: false },
  // Current month
  { day: 31, isCurrentMonth: false }, { day: 1, isCurrentMonth: true, events: [{ title: 'All Day Event', color: 'bg-blue-200 text-blue-800' }] }, { day: 2, isCurrentMonth: true }, { day: 3, isCurrentMonth: true },
  { day: 4, isCurrentMonth: true }, { day: 5, isCurrentMonth: true }, { day: 6, isCurrentMonth: true }, { day: 7, isCurrentMonth: true }, { day: 8, isCurrentMonth: true }, { day: 9, isCurrentMonth: true }, { day: 10, isCurrentMonth: true },
  { day: 11, isCurrentMonth: true }, { day: 12, isCurrentMonth: true }, { day: 13, isCurrentMonth: true }, { day: 14, isCurrentMonth: true }, { day: 15, isCurrentMonth: true }, { day: 16, isCurrentMonth: true }, { day: 17, isCurrentMonth: true },
  { day: 18, isCurrentMonth: true }, { day: 19, isCurrentMonth: true }, { day: 20, isCurrentMonth: true, events: [{ title: '4p Repeating Event', color: 'bg-purple-200 text-purple-800' }] }, { day: 21, isCurrentMonth: true }, { day: 22, isCurrentMonth: true }, 
  { day: 23, isCurrentMonth: true, isToday: true, events: [{ title: '10:30a Meeting', color: 'bg-red-200 text-red-800' }, { title: '12p Lunch', color: 'bg-orange-200 text-orange-800' }, { title: '7p Birthday Party', color: 'bg-blue-200 text-blue-800' }] },
  { day: 24, isCurrentMonth: true },
  { day: 25, isCurrentMonth: true }, { day: 26, isCurrentMonth: true }, { day: 27, isCurrentMonth: true, events: [{ title: '4p Repeating Event', color: 'bg-purple-200 text-purple-800' }] }, { day: 28, isCurrentMonth: true, events: [{ title: 'Click for Google', color: 'bg-blue-200 text-blue-800' }] }, { day: 29, isCurrentMonth: true }, { day: 30, isCurrentMonth: true }, { day: 31, isCurrentMonth: true },
  // Next month
  { day: 1, isCurrentMonth: false }, { day: 2, isCurrentMonth: false }, { day: 3, isCurrentMonth: false }, { day: 4, isCurrentMonth: false }, { day: 5, isCurrentMonth: false }, { day: 6, isCurrentMonth: false }, { day: 7, isCurrentMonth: false },
];

export default function CalendarPage() {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-full items-start">
      <div className="lg:col-span-3">
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Agenda</CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
             <Button size="lg" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Evento
            </Button>
             {events.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent">
                    <div className={`mt-1.5 h-3 w-3 rounded-full ${event.color} flex-shrink-0`}></div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-9">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-bold">August 2025</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline">day</Button>
                    <Button variant="outline">week</Button>
                    <Button variant="secondary">month</Button>
                     <div className="flex items-center gap-1 border rounded-md ml-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="outline" className="h-8 px-3">today</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 border-t border-l">
                    {weekDays.map(day => (
                        <div key={day} className="p-2 border-r border-b text-center font-semibold text-sm text-muted-foreground bg-muted/20">{day}</div>
                    ))}
                    {calendarDays.map((day, index) => (
                        <div key={index} className={`p-2 border-r border-b h-32 flex flex-col ${day.isCurrentMonth ? '' : 'bg-muted/30 text-muted-foreground'}`}>
                           <span className={`self-end ${day.isToday ? 'bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>{day.day}</span>
                           <div className="space-y-1 mt-1 overflow-y-auto">
                               {day.events?.map((event, eventIndex) => (
                                    <Badge key={eventIndex} className={`${event.color} w-full justify-start truncate`}>{event.title}</Badge>
                               ))}
                           </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

