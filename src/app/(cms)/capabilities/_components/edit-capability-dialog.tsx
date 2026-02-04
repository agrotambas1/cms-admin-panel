import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateCapability } from "@/hooks/capability/use-capability";
import { Capability } from "@/types/capability/capability";
import { UpdateCapabilityForm } from "@/validations/capability/capability-validation";
import { CapabilityForm } from "./capability-form";

interface UpdateCapabilityDialogProps {
  capability: Capability;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapabilityUpdated: () => void;
}

export function UpdateCapabilityDialog({
  capability,
  open,
  onOpenChange,
  onCapabilityUpdated,
}: UpdateCapabilityDialogProps) {
  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    updateCapability,
  } = useUpdateCapability({
    capability,
    open,
    onSuccess: () => {
      onOpenChange(false);
      onCapabilityUpdated();
    },
  });

  const onSubmit = async (data: UpdateCapabilityForm) => {
    const result = await updateCapability(data);
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
          <DialogTitle>Edit Capability</DialogTitle>
          <DialogDescription>Update capability information</DialogDescription>
        </DialogHeader>

        <CapabilityForm
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
