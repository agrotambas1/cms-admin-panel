import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateService } from "@/hooks/service/use-service";
import { Service } from "@/types/service/service";
import { UpdateServiceForm } from "@/validations/service/service-validation";
import { ServiceForm } from "./service-form";

interface UpdateServiceDialogProps {
  service: Service;
  open: boolean;
  canEdit: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceUpdated: () => void;
}

export function UpdateServiceDialog({
  service,
  open,
  canEdit,
  onOpenChange,
  onServiceUpdated,
}: UpdateServiceDialogProps) {
  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    updateService,
  } = useUpdateService({
    service,
    open,
    canEdit,
    onSuccess: () => {
      onOpenChange(false);
      onServiceUpdated();
    },
  });

  const onSubmit = async (data: UpdateServiceForm) => {
    const result = await updateService(data);
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
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>Update service information</DialogDescription>
        </DialogHeader>

        <ServiceForm
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
