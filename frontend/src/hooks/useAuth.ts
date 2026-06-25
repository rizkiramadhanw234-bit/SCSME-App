import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerUser, loginUser, logoutUser } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types";

const userKey = { user: ["user"] };

export const useLogin = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation<AuthResponse & { user: User }, unknown, LoginRequest>({
    mutationFn: async (data: LoginRequest) => await loginUser(data),
    onSuccess: (data: AuthResponse & { user: User }) => {
      queryClient.invalidateQueries({ queryKey: userKey.user });
      setUser(data);
      router.push("/");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useRegister = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<AuthResponse, unknown, RegisterRequest>({
    mutationFn: async (data: RegisterRequest) => await registerUser(data),
    onSuccess: (data: AuthResponse) => {
      queryClient.invalidateQueries({ queryKey: userKey.user });
      setUser(data);
      router.push("/login");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  return useMutation<void, unknown, void>({
    mutationFn: async () => await logoutUser(),
    onSuccess: () => {
      clearAuth();
      router.push("/auth/login");
    },
  });
};
