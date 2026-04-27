"use client";

import AppSidebar from "@/components/app-sidebar";

export default function RMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AppSidebar />

      <main className="flex-1 ml-64 mt-24 p-6 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}