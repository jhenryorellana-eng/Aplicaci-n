import { BottomNav } from "@/components/nav/BottomNav";
import { Toaster } from "@/components/ui/Toaster";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-[100dvh]">
      {children}
      <BottomNav />
      <Toaster />
    </div>
  );
}
