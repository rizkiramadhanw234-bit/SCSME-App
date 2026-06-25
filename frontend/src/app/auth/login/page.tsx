"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginRequest } from "@/types";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: login, isPending, isError } = useLogin();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      router.push("/");
    }
  }, [accessToken, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(form);
    } catch (error) {
      console.error(error, isError);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-sm">
          {isError && (
            <p className="text-red-500 ml-4">
              {isError ? "Invalid credentials" : ""}
            </p>
          )}
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="show-password"
                      className="mr-2"
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <label htmlFor="show-password">Show password</label>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button type="submit" className="w-full">
                  {isPending ? "Loading..." : "Login"}
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="underline-offset-4 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
