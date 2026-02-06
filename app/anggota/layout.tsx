import AppSidebar from "@/components/app-sidebar";

export default function AnggotaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AppSidebar />
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
