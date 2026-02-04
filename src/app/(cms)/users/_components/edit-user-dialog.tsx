"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateUserForm } from "@/validations/user/user-validation";
import { useUpdateUser } from "@/hooks/users/use-users";
import { User } from "@/types/users/user";
import { UserForm } from "./user-form";

interface UpdateUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export function UpdateUserDialog({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: UpdateUserDialogProps) {
  const { form, loading, updateUser } = useUpdateUser({
    user,
    onSuccess: () => {
      onOpenChange(false);
      onUserUpdated();
    },
  });

  const onSubmit = async (data: UpdateUserForm) => {
    const result = await updateUser(data);
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
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and status.
          </DialogDescription>
        </DialogHeader>

        <UserForm
          form={form}
          onSubmit={onSubmit}
          loading={loading}
          mode="update"
        />
      </DialogContent>
    </Dialog>
  );
}
