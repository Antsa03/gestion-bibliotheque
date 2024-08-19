import React from "react";
interface ContentLayoutProps {
  children: React.ReactNode;
}

export function ContentLayoutDefault({ children }: ContentLayoutProps) {
  return (
    <div>
      <div className="container py-4">{children}</div>
    </div>
  );
}
