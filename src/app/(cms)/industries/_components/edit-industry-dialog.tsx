import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateIndustry } from "@/hooks/industry/use-industry";
import { Industry } from "@/types/industry/industry";
import { UpdateIndustryForm } from "@/validations/industry/industry-validation";
import { IndustryForm } from "./industry-form";

interface UpdateIndustryDialogProps {
  industry: Industry;
  open: boolean;
  canEdit: boolean;
  onOpenChange: (open: boolean) => void;
  onIndustryUpdated: () => void;
}

export function UpdateIndustryDialog({
  industry,
  open,
  canEdit,
  onOpenChange,
  onIndustryUpdated,
}: UpdateIndustryDialogProps) {
  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    updateIndustry,
  } = useUpdateIndustry({
    industry,
    open,
    canEdit,
    onSuccess: () => {
      onOpenChange(false);
      onIndustryUpdated();
    },
  });

  const onSubmit = async (data: UpdateIndustryForm) => {
    const result = await updateIndustry(data);
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
          <DialogTitle>Edit Industry</DialogTitle>
          <DialogDescription>Update industry information</DialogDescription>
        </DialogHeader>

        <IndustryForm
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
