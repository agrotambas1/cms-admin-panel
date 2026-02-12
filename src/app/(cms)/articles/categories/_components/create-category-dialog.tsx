import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateCategory } from "@/hooks/articles/use-category";
import { CreateCategoryForm } from "@/validations/article/category-validation";
import { useState } from "react";
import { CategoryForm } from "./category-form";
import { Plus } from "lucide-react";

interface CreateCategoryDialogProps {
  onCategoryCreated: () => void;
}

export function CreateCategoryDialog({
  onCategoryCreated,
}: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    createCategory,
  } = useCreateCategory(() => {
    setOpen(false);
    onCategoryCreated();
  });

  const onSubmit = async (data: CreateCategoryForm) => {
    const result = await createCategory(data);
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
          New Category
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>Add a new category</DialogDescription>
        </DialogHeader>

        <CategoryForm
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
