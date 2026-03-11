
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
    items: { value: string; label: string }[];
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    noResultsText?: string;
    noResultsContent?: React.ReactNode;
    disabled?: boolean;
    creatable?: boolean;
    onCreate?: (value: string) => void;
}

export function Combobox({ 
    items, 
    value, 
    onValueChange,
    placeholder = "Selecione um item...",
    searchPlaceholder = "Buscar item...",
    noResultsText = "Nenhum item encontrado.",
    noResultsContent,
    disabled = false,
    creatable = false,
    onCreate,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const handleCreate = () => {
    if (onCreate && search) {
      onCreate(search)
      setSearch("")
      setOpen(false)
    }
  }

  // Filtragem manual para garantir que os itens desapareçam conforme a digitação
  const filteredItems = React.useMemo(() => {
    if (!search) return items;
    const lowerSearch = search.toLowerCase();
    return items.filter(item => 
      item.label.toLowerCase().includes(lowerSearch)
    );
  }, [items, search]);

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setSearch(""); // Limpa a busca ao fechar
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          type="button"
        >
          <span className="truncate">
            {value
                ? items.find((item) => item.value === value)?.label
                : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {filteredItems.length === 0 && (
                <CommandEmpty>
                {creatable && search ? (
                    <Button variant="ghost" className="w-full justify-start" onClick={handleCreate}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Criar "{search}"
                    </Button>
                ) : (
                    noResultsContent || noResultsText
                )}
                </CommandEmpty>
            )}
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    onValueChange(item.value)
                    setOpen(false)
                    setSearch("")
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
