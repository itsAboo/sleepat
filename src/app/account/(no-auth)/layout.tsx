import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function NoAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();
  if (user) {
    return redirect("/");
  }
  return children;
}
