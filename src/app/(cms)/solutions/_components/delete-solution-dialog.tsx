import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteSolution } from "@/hooks/solution/use-solution";

interface Solution {
  id: string;
  name: string;
}

interface DeleteSolutionDialogProps {
  solution: Solution;
  open: boolean;
  canDelete: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteSolutionDialog({
  solution,
  open,
  canDelete,
  onOpenChange,
  onDeleted,
}: DeleteSolutionDialogProps) {
  const { loading, deleteSolution } = useDeleteSolution({
    solutionId: solution.id,
    solutionName: solution.name,
    canDelete,
    onSuccess: () => {
      onOpenChange(false);
      onDeleted();
    },
  });

  const handleDelete = async () => {
    const result = await deleteSolution();
    if (result.success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Solution</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{solution.name}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
