import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateSolution } from "@/hooks/solution/use-solution";
import { Solution } from "@/types/solution/solution";
import { UpdateSolutionForm } from "@/validations/solution/solution-validation";
import { SolutionForm } from "./solution-form";

interface UpdateSolutionDialogProps {
  solution: Solution;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSolutionUpdated: () => void;
}

export function UpdateSolutionDialog({
  solution,
  open,
  onOpenChange,
  onSolutionUpdated,
}: UpdateSolutionDialogProps) {
  const {
    form,
    loading,
    isSlugTouched,
    setIsSlugTouched,
    handleNameChange,
    resetSlug,
    updateSolution,
  } = useUpdateSolution({
    solution,
    open,
    onSuccess: () => {
      onOpenChange(false);
      onSolutionUpdated();
    },
  });

  const onSubmit = async (data: UpdateSolutionForm) => {
    const result = await updateSolution(data);
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
          <DialogTitle>Edit Solution</DialogTitle>
          <DialogDescription>Update solution information</DialogDescription>
        </DialogHeader>

        <SolutionForm
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
