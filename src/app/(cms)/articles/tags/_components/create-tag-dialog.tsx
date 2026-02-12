import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateTag } from "@/hooks/articles/use-tag";
import { CreateTagForm } from "@/validations/article/tag-validation";
import { useState } from "react";
import { TagForm } from "./tag-form";
import { Plus } from "lucide-react";

interface CreateTagDialogProps {
  onTagCreated: () => void;
}

export function CreateTagDialog({ onTagCreated }: CreateTagDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    createTag,
  } = useCreateTag(() => {
    setOpen(false);
    onTagCreated();
  });

  const onSubmit = async (data: CreateTagForm) => {
    const result = await createTag(data);
    if (result.success) {
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Tag
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
          <DialogDescription>Add a new tag</DialogDescription>
        </DialogHeader>

        <TagForm
          form={form}
          onSubmit={onSubmit}
          loading={loading}
          isSlugTouched={isSlugTouched}
          setIsSlugTouched={setIsSlugTouched}
          handleNameChange={handleNameChange}
          resetSlug={resetSlug}
          mode="create"
        />
      </DialogContent>
    </Dialog>
  );
}
