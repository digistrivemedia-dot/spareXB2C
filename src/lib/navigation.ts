import {
  Bike,
  CalendarPlus,
  Heart,
  House,
  type LucideIcon,
  Package,
  ShoppingBag,
  UserRound,
  Warehouse,
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

/** Profile, addresses, devices, help and enquiries all live under "My account". */
const myAccountPages = [
  "/account/profile",
  "/account/addresses",
  "/account/devices",
  "/account/help",
  "/account/enquiries",
];

/** Mobile bottom navigation. A logged-in customer's Home is their own home page (/ sends them there). */
export const mobileNav: NavItem[] = [
  { label: "Home", href: "/", icon: House, alsoActiveFor: ["/account"] },
  { label: "Shop", href: "/products", icon: ShoppingBag },
  { label: "Services", href: "/services", icon: Wrench, alsoActiveFor: ["/account/services"] },
  {
    label: "Orders",
    href: "/account/orders",
    icon: Package,
    alsoActiveFor: ["/account/returns"],
  },
  {
    label: "Account",
    href: "/account/settings",
    icon: UserRound,
    alsoActiveFor: myAccountPages,
  },
];

export type NavSection = {
  /** Shown above the group in the sidebar; the first group has none. */
  title?: string;
  items: NavItem[];
};

/** Account sidebar (desktop), grouped. */
export const accountNavSections: NavSection[] = [
  {
    items: [
      { label: "Home", href: "/account", icon: House },
      { label: "My vehicles", href: "/account/vehicles", icon: Bike },
    ],
  },
  {
    title: "Service",
    items: [
      { label: "Book a service", href: "/services/book", icon: CalendarPlus },
      { label: "My services", href: "/account/services", icon: Wrench },
      { label: "Favourite garages", href: "/account/garages", icon: Warehouse },
    ],
  },
  {
    title: "Shop",
    items: [
      { label: "Buy parts", href: "/products", icon: ShoppingBag },
      {
        label: "My orders",
        href: "/account/orders",
        icon: Package,
        alsoActiveFor: ["/account/returns"],
      },
      { label: "Saved parts", href: "/account/saved", icon: Heart },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "My account",
        href: "/account/settings",
        icon: UserRound,
        alsoActiveFor: myAccountPages,
      },
    ],
  },
];

/** The same links as one list: the account menu in the header, and working out the active page. */
export const accountNav: NavItem[] = accountNavSections.flatMap((section) => section.items);

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
