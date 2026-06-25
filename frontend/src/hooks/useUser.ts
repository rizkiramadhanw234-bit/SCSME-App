import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import type { User } from "@/types";
import { updateUser, getUserById } from "@/services/user.service";

const userKey = {
  user: (id: string) => ["user", id],
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: userKey.user(id),
    queryFn: async () => {
      const res = await getUserById(id);
      return res;
    },
  });
};

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: User) => await updateUser(id, data),
    onSuccess: (data: User) => {
      const userId = data.id;
      queryClient.invalidateQueries({
        queryKey: userKey.user(userId),
      });
    },
    onError: (error) => console.error(error),
  });
};
