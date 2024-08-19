import { ContentLayoutDefault } from "@/components/layouts/adherent-panel/content-layout-default";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContentLayoutDefault>{children}</ContentLayoutDefault>;
}
