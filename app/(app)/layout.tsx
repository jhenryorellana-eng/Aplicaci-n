import { BottomNav } from "@/components/nav/BottomNav";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-[100dvh]">
      {children}
      <BottomNav />
    </div>
  );
}
