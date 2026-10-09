export type BannerPlacement = "home-hero" | "home-strip" | "account";

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  image: {
    url: string;
    alt: string;
  };
  placements: BannerPlacement[];
};

export type Coupon = {
  code: string;
  description: string;
  discount:
    | { kind: "percent"; percent: number; maxInPaise: number }
    | { kind: "flat"; amountInPaise: number };
  minOrderInPaise: number;
  isFirstOrderOnly: boolean;
};

/** The server's answer when a customer enters a coupon code. */
export type CouponCheck = { valid: true; coupon: Coupon } | { valid: false; message: string };
