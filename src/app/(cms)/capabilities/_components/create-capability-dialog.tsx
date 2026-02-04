import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateCapability } from "@/hooks/capability/use-capability";
import { CreateCapabilityForm } from "@/validations/capability/capability-validation";
import { useState } from "react";
import { CapabilityForm } from "./capability-form";

interface CreateCapabilityDialogProps {
  onCapabilityCreated: () => void;
}

export function CreateCapabilityDialog({
  onCapabilityCreated,
}: CreateCapabilityDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    createCapability,
  } = useCreateCapability(() => {
    setOpen(false);
    onCapabilityCreated();
  });

  const onSubmit = async (data: CreateCapabilityForm) => {
    const result = await createCapability(data);
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
        <Button>Create Capability</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Capability</DialogTitle>
          <DialogDescription>Add a new capability</DialogDescription>
        </DialogHeader>

        <CapabilityForm
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
