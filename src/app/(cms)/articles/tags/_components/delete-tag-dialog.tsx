import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTag } from "@/hooks/articles/use-tag";
import { Tag } from "@/types/article/tag";

interface DeleteTagDialogProps {
  tag: Tag;
  open: boolean;
  canDelete: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteTagDialog({
  tag,
  open,
  canDelete,
  onOpenChange,
  onDeleted,
}: DeleteTagDialogProps) {
  const { loading, deleteTag } = useDeleteTag({
    tagId: tag.id,
    tagName: tag.name,
    canDelete,
    onSuccess: () => {
      onOpenChange(false);
      onDeleted();
    },
  });

  const handleDelete = async () => {
    const result = await deleteTag();
    if (result.success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Tag</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{tag.name}</span>? This action
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
