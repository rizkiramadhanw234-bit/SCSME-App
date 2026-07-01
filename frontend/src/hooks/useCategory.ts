import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types";
import {
  getCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/services/categories.service";

const categoryKey = {
  categories: ["categories"] as const,
  detail: (id: string) => [...categoryKey.categories, "detail", id] as const,
  lists: () => [...categoryKey.categories, "lists"] as const,
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: categoryKey.categories,
    queryFn: async () => {
      const res = await getCategories();
      return res;
    },
  });
};

export const useGetCategoryById = (id: string) => {
  return useQuery({
    queryKey: categoryKey.detail(id),
    queryFn: async () => {
      const res = await getCategoryById(id);
      return res;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      const res = await createCategory(data);
      return res;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(
        categoryKey.categories,
        (old: Category[] | null) => {
          if (!old) return [newData];
          return [...old, newData];
        },
      );
      queryClient.invalidateQueries({ queryKey: categoryKey.categories });
    },
    onError: (error) => console.error(error),
  });
};

export const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateCategoryRequest) => {
      const res = await updateCategory(id, data);
      return res;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(
        categoryKey.categories,
        (old: Category[] | null) => {
          if (!old) return [newData];
          return [...old, newData];
        },
      );
      queryClient.invalidateQueries({ queryKey: categoryKey.categories });
    },
    onError: (error) => console.error(error),
  });
};

export const useDeleteCategory = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKey.categories });
    },
    onError: (error) => console.error(error),
  });
};
