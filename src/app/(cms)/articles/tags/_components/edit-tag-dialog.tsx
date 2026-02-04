import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTag } from "@/hooks/articles/use-tag";
import { Tag } from "@/types/article/tag";
import { UpdateTagForm } from "@/validations/article/tag-validation";
import { TagForm } from "./tag-form";

interface UpdateTagDialogProps {
  tag: Tag;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTagUpdated: () => void;
}

export function UpdateTagDialog({
  tag,
  open,
  onOpenChange,
  onTagUpdated,
}: UpdateTagDialogProps) {
  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    updateTag,
  } = useUpdateTag({
    tag,
    open,
    onSuccess: () => {
      onOpenChange(false);
      onTagUpdated();
    },
  });

  const onSubmit = async (data: UpdateTagForm) => {
    const result = await updateTag(data);
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
          <DialogTitle>Edit Tag</DialogTitle>
          <DialogDescription>Update tag information</DialogDescription>
        </DialogHeader>

        <TagForm
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
