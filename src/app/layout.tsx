import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { StoreHydration } from "@/components/layout/StoreHydration";
import { Toaster } from "@/components/ui/sonner";
import { SITE_NAME } from "@/lib/constants";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} · Vehicle parts that fit, and service you can trust`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Shop genuine vehicle and scooter parts checked to fit your vehicle, and book a service at Kannali Garage in Bengaluru.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <body>
        {children}
        <StoreHydration />
        <Toaster />
      </body>
    </html>
  );
}
