import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "@/types";
import {
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
} from "@/services/company.service";

const companyKeys = {
  companies: ["companies"] as const,
  detail: (id: string) => [...companyKeys.companies, "detail", id] as const,
  lists: () => [...companyKeys.companies, "lists"] as const,
};

export const useGetCompanies = () => {
  return useQuery({
    queryKey: companyKeys.companies,
    queryFn: async () => {
      const res = await getCompanies();
      return res;
    },
  });
};

export const useGetCompanyById = (id: string) => {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: async () => {
      const res = await getCompanyById(id);
      return res;
    },
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCompanyRequest) => {
      const res = await createCompany(data);
      return res;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(companyKeys.lists(), (old: Company[] | null) => {
        if (!old) return [newData];
        return [...old, newData];
      });
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
    onError: (error) => console.error(error),
  });
};

export const useUpdateCompany = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateCompanyRequest) => {
      const res = await updateCompany(id, data);
      return res;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(companyKeys.lists(), (old: Company[] | null) => {
        if (!old) return [newData];
        return [...old, newData];
      });
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
    onError: (error) => console.error(error),
  });
};

export const useDeleteCompany = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
    onError: (error) => console.error(error),
  });
};
