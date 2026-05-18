import { redirect } from "next/navigation"
import CallerShell from "@/components/CallerShell"
import { getCurrentUser } from "@/lib/auth"

export const metadata = {
  title: "JTQ Llamadas",
}

export default async function CallerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/admin/login")
  }
  if (user.role !== "caller" && user.role !== "admin") {
    redirect("/admin/login")
  }

  return <CallerShell name={user.name}>{children}</CallerShell>
}
