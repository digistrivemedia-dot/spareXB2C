import {
  Bike,
  CircleHelp,
  Heart,
  House,
  type LucideIcon,
  MapPin,
  MapPinHouse,
  MessageSquareText,
  MonitorSmartphone,
  Package,
  ShoppingBag,
  UserRound,
  Wrench,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Other sections that belong under this item, e.g. returns under Orders. */
  alsoActiveFor?: string[];
};

export type NavLink = Omit<NavItem, "icon">;

/** The header's Shop / Service switch. Shop is the default, so every page outside Service shows it. */
export const modeNav: NavItem[] = [
  { label: "Shop", href: "/", icon: ShoppingBag },
  { label: "Service", href: "/services", icon: Wrench },
];

/** Mobile bottom navigation. */
export const mobileNav: NavItem[] = [
  { label: "Home", href: "/", icon: House },
  { label: "Shop", href: "/products", icon: ShoppingBag },
  { label: "Services", href: "/services", icon: Wrench },
  {
    label: "Orders",
    href: "/account/orders",
    icon: Package,
    alsoActiveFor: ["/account/returns"],
  },
  { label: "Account", href: "/account", icon: UserRound },
];

/** Account sidebar (desktop) and account menu in the header. */
export const accountNav: NavItem[] = [
  { label: "Home", href: "/account", icon: House },
  { label: "My vehicles", href: "/account/vehicles", icon: Bike },
  { label: "Services", href: "/account/services", icon: Wrench },
  {
    label: "Orders",
    href: "/account/orders",
    icon: Package,
    alsoActiveFor: ["/account/returns"],
  },
  { label: "Saved", href: "/account/saved", icon: Heart },
  { label: "Enquiries", href: "/account/enquiries", icon: MessageSquareText },
  { label: "Garages", href: "/services/garages", icon: MapPin },
  { label: "Profile", href: "/account/profile", icon: UserRound },
  { label: "Addresses", href: "/account/addresses", icon: MapPinHouse },
  { label: "Devices", href: "/account/devices", icon: MonitorSmartphone },
  { label: "Help", href: "/account/help", icon: CircleHelp },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All parts", href: "/products" },
      { label: "All categories", href: "/categories" },
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
  const isUnder = (path: string) =>
    pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
  return items
    .flatMap((item) => [item.href, ...(item.alsoActiveFor ?? [])].map((path) => ({ item, path })))
    .filter(({ path }) => isUnder(path))
    .sort((a, b) => b.path.length - a.path.length)[0]?.item.href;
}
