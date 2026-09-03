import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "./_components/admin-sidebar";
import { Toaster } from "sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 font-sans">
      <AdminSidebar user={session.user} />
      <main className="flex-1 overflow-y-auto bg-stone-50/50">
        <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
