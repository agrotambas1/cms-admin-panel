import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateIndustry } from "@/hooks/industry/use-industry";
import { CreateIndustryForm } from "@/validations/industry/industry-validation";
import { useState } from "react";
import { IndustryForm } from "./industry-form";

interface CreateIndustryDialogProps {
  onIndustryCreated: () => void;
}

export function CreateIndustryDialog({
  onIndustryCreated,
}: CreateIndustryDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    createIndustry,
  } = useCreateIndustry(() => {
    setOpen(false);
    onIndustryCreated();
  });

  const onSubmit = async (data: CreateIndustryForm) => {
    const result = await createIndustry(data);
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
        <Button>Create Industry</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Industry</DialogTitle>
          <DialogDescription>Add a new industry</DialogDescription>
        </DialogHeader>

        <IndustryForm
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
