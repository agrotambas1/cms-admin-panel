import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateSolution } from "@/hooks/solution/use-solution";
import { CreateSolutionForm } from "@/validations/solution/solution-validation";
import { useState } from "react";
import { SolutionForm } from "./solution-form";

interface CreateSolutionDialogProps {
  onSolutionCreated: () => void;
}

export function CreateSolutionDialog({
  onSolutionCreated,
}: CreateSolutionDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    createSolution,
  } = useCreateSolution(() => {
    setOpen(false);
    onSolutionCreated();
  });

  const onSubmit = async (data: CreateSolutionForm) => {
    const result = await createSolution(data);
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
        <Button>New Solution</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Solution</DialogTitle>
          <DialogDescription>Add a new solution</DialogDescription>
        </DialogHeader>

        <SolutionForm
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
