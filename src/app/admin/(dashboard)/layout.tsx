import { redirect } from "next/navigation"
import AdminShell from "@/components/AdminShell"
import { getCurrentUser } from "@/lib/auth"

export const metadata = {
  title: "JTQ Admin",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/admin/login")
  }
  if (user.role === "caller") {
    redirect("/admin/caller")
  }

  return <AdminShell>{children}</AdminShell>
}
