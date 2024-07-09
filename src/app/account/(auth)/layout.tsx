import { getUser } from "@/lib/lucia";
import { notFound } from "next/navigation";

export default async function AccountAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();
  if (!user) {
    return notFound();
  }
  return children;
}
