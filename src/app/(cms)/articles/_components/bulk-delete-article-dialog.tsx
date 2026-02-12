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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBulkDeleteArticles } from "@/hooks/articles/use-article";
import { useState } from "react";

interface BulkDeleteArticlesDialogProps {
  selectedIds: Set<string | number>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function BulkDeleteArticlesDialog({
  selectedIds,
  open,
  onOpenChange,
  onDeleted,
}: BulkDeleteArticlesDialogProps) {
  const [confirmText, setConfirmText] = useState("");

  const handleClose = () => {
    setConfirmText("");
    onOpenChange(false);
  };

  const { loading, bulkDeleteArticles } = useBulkDeleteArticles({
    onSuccess: () => {
      handleClose();
      onDeleted();
    },
  });

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;

    await bulkDeleteArticles(selectedIds);
  };

  const isDeleteEnabled = confirmText === "DELETE";

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        } else {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Multiple Articles</DialogTitle>
          <DialogDescription>
            You are about to delete{" "}
            <span className="font-semibold text-destructive">
              {selectedIds.size}
            </span>{" "}
            article{selectedIds.size > 1 ? "s" : ""}. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-delete">
              Type <span className="font-mono font-bold">DELETE</span> to
              confirm
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              disabled={loading}
              className="font-mono"
            />
          </div>

          <div className="rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              <strong>Warning:</strong> This will permanently delete all
              selected articles and their associated data.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isDeleteEnabled || loading}
          >
            {loading ? "Deleting..." : "Delete All"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
