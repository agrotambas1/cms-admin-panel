"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateUserForm } from "@/validations/user/user-validation";

import { useState } from "react";
import { useCreateUser } from "@/hooks/users/use-users";
import { UserForm } from "./user-form";

interface CreateUserDialogProps {
  onUserCreated: () => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { form, loading, createUser } = useCreateUser(() => {
    setOpen(false);
    onUserCreated();
  });

  const onSubmit = async (data: CreateUserForm) => {
    const result = await createUser(data);
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
        <Button>Create User</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. Fill in all fields.
          </DialogDescription>
        </DialogHeader>

        <UserForm
          form={form}
          onSubmit={onSubmit}
          loading={loading}
          mode="create"
        />
      </DialogContent>
    </Dialog>
  );
}
