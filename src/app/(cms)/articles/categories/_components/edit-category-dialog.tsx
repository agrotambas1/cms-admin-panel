import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateCategory } from "@/hooks/articles/use-category";
import { Category } from "@/types/article/category";
import { UpdateCategoryForm } from "@/validations/article/category-validation";
import { CategoryForm } from "./category-form";

interface UpdateCategoryDialogProps {
  category: Category;
  open: boolean;
  canEdit: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryUpdated: () => void;
}

export function UpdateCategoryDialog({
  category,
  open,
  canEdit,
  onOpenChange,
  onCategoryUpdated,
}: UpdateCategoryDialogProps) {
  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    updateCategory,
  } = useUpdateCategory({
    category,
    open,
    canEdit,
    onSuccess: () => {
      onOpenChange(false);
      onCategoryUpdated();
    },
  });

  const onSubmit = async (data: UpdateCategoryForm) => {
    const result = await updateCategory(data);
    if (result.success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) form.reset();
      }}
    >
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update category information</DialogDescription>
        </DialogHeader>

        <CategoryForm
          form={form}
          onSubmit={onSubmit}
          loading={loading}
          isSlugTouched={isSlugTouched}
          setIsSlugTouched={setIsSlugTouched}
          handleNameChange={handleNameChange}
          resetSlug={resetSlug}
          mode="update"
        />
      </DialogContent>
    </Dialog>
  );
}
