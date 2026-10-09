/**
 * A bar pinned just above the mobile bottom nav, for a page's main action (price + Add to cart, total + checkout).
 * SiteShell spots `data-mobile-bar` and adds bottom padding, so the bar never covers the footer.
 */
export function MobileActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-mobile-bar
      className="fixed inset-x-0 bottom-16 z-30 flex items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 shadow-lg lg:hidden"
    >
      {children}
    </div>
  );
}
