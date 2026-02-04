"use client";

import { useState, useEffect } from "react";

import { User, UserFilters } from "../../types/users/user";
import { PaginationState } from "@/components/common/table/data-table";
import { cmsApi } from "@/lib/api";
import { useForm } from "react-hook-form";
import {
  CreateUserForm,
  createUserSchema,
  UpdateUserForm,
  updateUserSchema,
} from "@/validations/user/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface UseUsersParams extends UserFilters {
  page: number;
  limit: number;
}

export function useUsers({ search, role, page, limit }: UseUsersParams) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const { data } = await cmsApi.get("/users", {
          params: {
            search,
            role,
            page,
            limit,
          },
        });

        setUsers(data.data || data.users || data);
        setPagination({
          page: data.meta.page,
          limit: data.meta.limit,
          total: data.meta.total,
        });
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [search, role, page, limit]);

  const refetch = async () => {
    const { data } = await cmsApi.get("/users", {
      params: {
        search,
        role,
        page,
        limit,
      },
    });

    setUsers(data.data || data.users || data);
    setPagination({
      page: data.meta?.page ?? page,
      limit: data.meta?.limit ?? limit,
      total: data.meta?.total ?? 0,
    });
  };

  return { users, loading, error, pagination, refetch };
}

export function useCreateUser(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      role: "",
      password: "",
    },
  });

  const createUser = async (data: CreateUserForm) => {
    setLoading(true);
    try {
      await cmsApi.post("/users", data);

      toast.success(`User ${data.name} created successfully`);

      form.reset();
      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Failed to create user");
      return { success: false, error: "Failed to create user" };
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, createUser };
}

interface UseUpdateUserParams {
  user: User;
  onSuccess?: () => void;
}

export function useUpdateUser({ user, onSuccess }: UseUpdateUserParams) {
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      role: "",
      isActive: "true",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive ? "true" : "false",
        password: "",
      });
    }
  }, [user, form]);

  const updateUser = async (data: UpdateUserForm) => {
    setLoading(true);
    try {
      await cmsApi.put(`/users/${user.id}`, {
        ...data,
        isActive: data.isActive === "true",
        ...(data.password ? { password: data.password } : {}),
      });

      toast.success(`User ${data.name} updated successfully`);

      onSuccess?.();

      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
      return { success: false, error: "Failed to update user" };
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, updateUser };
}

interface UseDeleteUserParams {
  canDelete?: boolean;
  onSuccess?: () => void;
}

export function useDeleteUser({
  canDelete = true,
  onSuccess,
}: UseDeleteUserParams = {}) {
  const [loading, setLoading] = useState(false);

  const deleteUser = async (userId: string, userName?: string) => {
    if (!canDelete) {
      toast.error("You are not allowed to delete this user");
      return { success: false, error: "Permission denied" };
    }

    setLoading(true);
    try {
      await cmsApi.delete(`/users/${userId}`);

      toast.success(
        userName
          ? `User ${userName} deleted successfully`
          : "User deleted successfully",
      );

      onSuccess?.();
      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
      return { success: false, error: "Failed to delete user" };
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteUser };
}
