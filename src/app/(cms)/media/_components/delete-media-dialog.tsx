"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaFile } from "../../../../types/media/media";
import { useDeleteMedia } from "@/hooks/media/use-media";

interface DeleteMediaDialogProps {
  media: MediaFile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteMediaDialog({
  media,
  open,
  onOpenChange,
  onDeleted,
}: DeleteMediaDialogProps) {
  const { deleting, deleteMedia } = useDeleteMedia({
    onSuccess: () => {
      onOpenChange(false);
      onDeleted();
    },
  });

  const handleDelete = async () => {
    await deleteMedia(media.id);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Media</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this media?
            <br />
            <span className="font-semibold">This action cannot be undone</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
