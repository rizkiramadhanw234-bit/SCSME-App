"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRegister } from "@/hooks/useAuth";
import type { AuthResponse, RegisterRequest, UserRole } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import Link from "next/link";
import { SpinnerCustom } from "@/components/ui/spinner";
import { axiosApi } from "@/services/axios";
import { useAuthStore } from "@/stores/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const userRole = [
    { label: "Guest", value: "guest" },
    { label: "Member", value: "member" },
    { label: "Corporate", value: "corporate" },
    { label: "Sponsor", value: "sponsor" },
  ];

  const { mutateAsync: register, isPending, isError } = useRegister();
  const [form, setForm] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, accessToken, isHydrated } = useAuthStore();

  useEffect(() => {
    axiosApi
      .post("/user/refresh-token")
      .then((res) => {
        const data = res.data as AuthResponse;
        if (accessToken) {
          router.push("/home");
          return;
        }
        setUser(data);
      })
      .catch(() => {
        setUser(null);
        router.replace("/auth/login");
      });
  }, [setUser, router, accessToken]);

  if (!isHydrated)
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerCustom />
      </div>
    );
  if (accessToken) return null;

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const emailExists = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/email?email=${email}`,
    );
    if (emailExists.ok) {
      alert("Email already exists");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format");
      return;
    }
    if (form.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (form.role === "") {
      alert("Please select a role");
      return;
    }
    try {
      await register(form);
      router.push("/auth/login");
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
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="name"
                    placeholder="kudukuats"
                    required
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
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
                    <Label htmlFor="confirmPassword">Phone Number</Label>
                  </div>
                  <Input
                    id="phone"
                    type="phone"
                    required
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <NativeSelect
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value as UserRole })
                    }
                  >
                    <NativeSelectOption value="">
                      Select Role
                    </NativeSelectOption>
                    {userRole.map((role) => (
                      <NativeSelectOption key={role.value} value={role.value}>
                        {role.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
              </div>
              <div className="mt-4">
                <Button type="submit" className="w-full">
                  {isPending ? "Loading..." : "Sign Up"}
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-center">
                  Already have an account? <Link href="/auth/login">Login</Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
