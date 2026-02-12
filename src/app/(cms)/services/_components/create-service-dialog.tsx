import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateService } from "@/hooks/service/use-service";
import { CreateServiceForm } from "@/validations/service/service-validation";
import { useState } from "react";
import { ServiceForm } from "./service-form";
import { Plus } from "lucide-react";

interface CreateServiceDialogProps {
  onServiceCreated: () => void;
}

export function CreateServiceDialog({
  onServiceCreated,
}: CreateServiceDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    createService,
  } = useCreateService(() => {
    setOpen(false);
    onServiceCreated();
  });

  const onSubmit = async (data: CreateServiceForm) => {
    const result = await createService(data);
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
          New Service
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
          <DialogDescription>Add a new service</DialogDescription>
        </DialogHeader>

        <ServiceForm
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
