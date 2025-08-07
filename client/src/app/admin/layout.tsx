import { requireAdminAuth } from "../../lib/admin-auth";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Server-side admin auth check
  await requireAdminAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="ml-64">
        {/* Top navbar */}
        <AdminNavbar />

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
