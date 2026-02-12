// components/common/filters/multi-select-filter.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MultiSelectFilterProps {
  placeholder: string;
  options: { label: string; value: string }[];
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  className?: string;
}

export function MultiSelectFilter({
  placeholder,
  options,
  selectedValues,
  onValuesChange,
  className,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onValuesChange(newValues);
  };

  const handleClear = () => {
    onValuesChange([]);
  };

  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {selectedValues.length > 0 ? (
            <span className="truncate">
              {selectedValues.length === 1
                ? selectedLabels[0]
                : `${selectedValues.length} selected`}
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-3" align="start">
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
              onClick={() => handleToggle(option.value)}
            >
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
              />
              <label className="text-sm cursor-pointer flex-1">
                {option.label}
              </label>
            </div>
          ))}
        </div>

        {selectedValues.length > 0 && (
          <div className="border-t mt-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={handleClear}
            >
              <X className="mr-2 h-4 w-4" />
              Clear ({selectedValues.length})
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
