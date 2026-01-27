import AdminSidebar from "@/src/app/admin/dashboard/components/Sidebar";
import Navbar from "@/src/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
          <AdminSidebar />

        {/* Right Section */}
        <div className="flex flex-1 flex-col">
          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </>
  );
}
