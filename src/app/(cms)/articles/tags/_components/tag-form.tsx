import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface TagFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  loading: boolean;
  isSlugTouched: boolean;
  setIsSlugTouched: (isSlugTouched: boolean) => void;
  handleNameChange: (name: string) => void;
  resetSlug: () => void;
  mode: "create" | "update";
}

export function TagForm<T extends FieldValues>({
  form,
  onSubmit,
  loading,
  isSlugTouched,
  setIsSlugTouched,
  handleNameChange,
  resetSlug,
  mode,
}: TagFormProps<T>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name={"name" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleNameChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"slug" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    {...field}
                    className={mode === "update" ? "bg-muted" : ""}
                    onChange={(e) => {
                      field.onChange(e);
                      setIsSlugTouched(true);
                    }}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!isSlugTouched}
                  onClick={resetSlug}
                >
                  Reset
                </Button>
              </div>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {mode === "update" && (
          <FormField
            control={form.control}
            name={"isActive" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Tag"
              : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
