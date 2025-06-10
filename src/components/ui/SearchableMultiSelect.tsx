import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Badge } from './badge';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableMultiSelectProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select items...',
  label,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  const removeValue = (valueToRemove: string) => {
    onChange(selectedValues.filter((value) => value !== valueToRemove));
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-gray-200 hover:bg-gray-50"
          >
            <span className="truncate">
              {selectedValues.length === 0
                ? placeholder
                : `${selectedValues.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search..."
              value={search}
              onValueChange={setSearch}
              className="h-9"
            />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => toggleOption(option)}
                  className="flex items-center gap-2"
                >
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border border-gray-200',
                      selectedValues.includes(option) && 'bg-bahayCebu-green text-white'
                    )}
                  >
                    {selectedValues.includes(option) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <span>{option}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Values */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedValues.map((value) => (
            <Badge
              key={value}
              variant="secondary"
              className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {value}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeValue(value)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableMultiSelect; 