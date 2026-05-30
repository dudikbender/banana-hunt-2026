import type { Metadata } from "next";

import { AdminPanel } from "@/components/admin/admin-panel";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-muted/30 p-6">
      <AdminPanel />
    </div>
  );
}
