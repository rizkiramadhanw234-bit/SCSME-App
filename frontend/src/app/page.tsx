import { redirect } from "next/navigation";

export default function Page() {
  const res = redirect("/home");
  return res;
}
