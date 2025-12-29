
"use client"

import * as React from "react"
import { format, setHours, setMinutes, parseISO } from "date-fns"
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
    date?: Date | string | null;
    onDateChange?: (date: string | null) => void;
}

export function DatePicker({ showTime = false, date: propDate, onDateChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>();
  const [time, setTime] = React.useState("00:00");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (propDate) {
        try {
            const parsedDate = typeof propDate === 'string' ? parseISO(propDate) : propDate;
            if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
                setDate(parsedDate);
                if (showTime) {
                  setTime(format(parsedDate, 'HH:mm'));
                }
            } else {
                 setDate(undefined);
            }
        } catch (error) {
            setDate(undefined);
            console.error("Invalid date prop:", propDate);
        }
    } else {
        setDate(undefined);
    }
  }, [propDate, showTime]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
        setDate(undefined);
        if (onDateChange) onDateChange(null);
        return;
    }

    let newDate = selectedDate;
    if (showTime) {
      const [hours, minutes] = time.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        newDate = setHours(newDate, hours);
        newDate = setMinutes(newDate, minutes);
      }
    }
    
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate.toISOString());
    }

    if (!showTime) {
      setIsOpen(false);
    }
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
             if (onDateChange) {
               onDateChange(newDate.toISOString());
             }
        }
    }
  }
  
  const displayFormat = showTime ? "PPP HH:mm" : "PPP";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
      <PopoverContent className="w-auto p-0">
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
