import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

/** Header, footer and mobile bottom nav around a page. Shared by the storefront and account layouts. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    // Bottom padding keeps the footer clear of the fixed mobile nav, and of a MobileActionBar when the page has one.
    <div className="flex min-h-dvh flex-col pb-16 has-data-mobile-bar:pb-36 lg:pb-0 lg:has-data-mobile-bar:pb-0">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-semibold text-navy-800 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
