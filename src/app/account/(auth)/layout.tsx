import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function AccountAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();
  if (!user) {
    return redirect("/account/signin");
  }
  return children;
}
