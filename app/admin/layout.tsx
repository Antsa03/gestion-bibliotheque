"use client";
import AdminPanelLayout from "@/components/layouts/admin-panel/admin-panel-layout";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
