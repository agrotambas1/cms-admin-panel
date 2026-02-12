"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MediaTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function MediaTypeFilter({ value, onChange }: MediaTypeFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Media" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Media</SelectItem>
        <SelectItem value="image">Images</SelectItem>
        <SelectItem value="video">Videos</SelectItem>
        <SelectItem value="document">Documents</SelectItem>
      </SelectContent>
    </Select>
  );
}
