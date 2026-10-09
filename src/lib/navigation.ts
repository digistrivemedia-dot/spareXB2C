import {
  Bike,
  CircleHelp,
  Heart,
  House,
  type LucideIcon,
  MapPin,
  Package,
  ShoppingBag,
  UserRound,
  Wrench,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavLink = Omit<NavItem, "icon">;

/** Mobile bottom navigation. */
export const mobileNav: NavItem[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Shop", href: "/products", icon: ShoppingBag },
  { label: "Services", href: "/services", icon: Wrench },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Account", href: "/account", icon: UserRound },
];

/** Account sidebar (desktop) and account menu in the header. */
export const accountNav: NavItem[] = [
  { label: "Home", href: "/account", icon: House },
  { label: "My bikes", href: "/account/bikes", icon: Bike },
  { label: "Services", href: "/account/services", icon: Wrench },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Saved", href: "/account/saved", icon: Heart },
  { label: "Garages", href: "/account/garages", icon: MapPin },
  { label: "Help", href: "/account/help", icon: CircleHelp },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All parts", href: "/products" },
      { label: "Engine oil", href: "/products?category=engine-oil" },
      { label: "Brakes", href: "/products?category=brakes" },
      { label: "Book a service", href: "/services/book" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "About us", href: "/about" },
      { label: "Help centre", href: "/help" },
      { label: "Track your order", href: "/account/orders" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy policy", href: "/policies/privacy" },
      { label: "Terms of use", href: "/policies/terms" },
      { label: "Returns and refunds", href: "/policies/returns" },
      { label: "Shipping", href: "/policies/shipping" },
    ],
  },
];

/** The href of the item that best matches the current page: the longest one that is the page or contains it. */
export function getActiveHref(pathname: string, items: NavLink[]): string | undefined {
  return items
    .map((item) => item.href)
    .filter((href) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)))
    .sort((a, b) => b.length - a.length)[0];
}
