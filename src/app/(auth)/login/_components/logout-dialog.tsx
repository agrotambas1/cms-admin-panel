// components/dialogs/LogoutDialog.tsx (atau sesuai struktur folder lu)

"use client";

import { cmsApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const handleLogout = async () => {
    try {
      await cmsApi.post("/logout");
      setTimeout(() => {
        window.location.href = "/login";
      }, 0);
    } catch (error) {
      console.error("Logout error:", error);
      setTimeout(() => {
        window.location.href = "/login";
      }, 0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out of the application?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-700 text-white"
            onClick={handleLogout}
          >
            Yes, Log Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
