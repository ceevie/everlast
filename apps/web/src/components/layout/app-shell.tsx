import { ReactNode } from "react";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-h-screen">
      <Sidebar />
      <main className="flex-1 bg-muted/10 py-6">
        <div className="mx-auto w-full max-w-6xl px-6">{children}</div>
      </main>
    </div>
  );
}