import { SiteShell } from "@/components/layout/SiteShell";

export default function StoreLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
