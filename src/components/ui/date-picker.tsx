
"use client"

import * as React from "react"
import { format, setHours, setMinutes, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { ptBR } from 'date-fns/locale';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    showTime?: boolean;
}

export function DatePicker({ showTime = false }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()
  const [time, setTime] = React.useState("00:00");
  const popoverRef = React.useRef<HTMLDivElement>(null);


  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
        setDate(undefined);
        return;
    }
    const [hours, minutes] = time.split(':').map(Number);
    let newDate = setHours(selectedDate, hours);
    newDate = setMinutes(newDate, minutes);
    setDate(newDate);
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (date) {
        const [hours, minutes] = newTime.split(':').map(Number);
        if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
            let newDate = setHours(date, hours);
            newDate = setMinutes(newDate, minutes);
            setDate(newDate);
        }
    }
  }
  
  const displayFormat = showTime ? "PPP HH:mm" : "PPP";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, displayFormat, { locale: ptBR }) : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent ref={popoverRef} className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          locale={ptBR}
        />
        {showTime && (
            <div className="p-3 border-t">
                <Input 
                    type="time" 
                    value={time}
                    onChange={handleTimeChange}
                />
            </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
