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
import { cmsApi } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useDeleteMediaBulk } from "@/hooks/media/use-media";

interface DeleteMediaBulkDialogProps {
  ids: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteMediaBulkDialog({
  ids,
  open,
  onOpenChange,
  onDeleted,
}: DeleteMediaBulkDialogProps) {
  const { deleting, deleteMediaBulk } = useDeleteMediaBulk({
    onSuccess: () => {
      onOpenChange(false);
      onDeleted();
    },
  });

  const handleDelete = async () => {
    await deleteMediaBulk(ids);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete {ids.length} Media</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{ids.length}</span> media?
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
            disabled={deleting || ids.length === 0}
          >
            {deleting ? "Deleting..." : "Delete All"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
