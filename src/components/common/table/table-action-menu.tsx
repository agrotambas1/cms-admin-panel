import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

// export interface TableAction<T> {
//   label?: string;
//   onClick: (item: T) => void;
//   render?: (item: T) => React.ReactNode;
//   variant?: "default" | "destructive";
//   separator?: boolean;
// }

export type TableAction<T> =
  | {
      label: string;
      href: string;
      icon?: React.ReactNode;
      render?: (item: T) => React.ReactNode;
      variant?: "default" | "destructive";
      separator?: boolean;
      disabled?: boolean;
    }
  | {
      label: string;
      onClick: (item: T) => void;
      icon?: React.ReactNode;
      render?: (item: T) => React.ReactNode;
      variant?: "default" | "destructive";
      separator?: boolean;
      disabled?: boolean;
    };

interface TableActionsMenuProps<T> {
  item: T;
  actions: TableAction<T>[];
}

export function TableActionsMenu<T>({
  item,
  actions,
}: TableActionsMenuProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {actions.map((action, index) => {
          const content = action.render ? (
            action.render(item)
          ) : (
            <span className="flex items-center gap-4">
              {action.icon}
              {action.label}
            </span>
          );

          if ("href" in action) {
            return (
              <DropdownMenuItem key={index} asChild>
                <Link href={action.href}>{content}</Link>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={index}
              onClick={() => action.onClick(item)}
              className={action.variant === "destructive" ? "text-red-600" : ""}
              disabled={action.disabled}
            >
              {content}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
