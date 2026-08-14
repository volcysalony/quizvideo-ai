import type { ReactNode } from "react";

import { AppSidebar } from "./AppSidebar";

type Props = {
  children: ReactNode;
};

export function AppShell({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[#080d16] text-white">
      <AppSidebar />

      <div className="min-h-screen lg:pl-[230px]">
        {children}
      </div>
    </div>
  );
}