import { Wrench } from "lucide-react";
import Link from "next/link";

import { SHOP_NAME, SITE_NAME } from "@/lib/constants";

/** Text wordmark until the client's logo arrives; swapping it in only changes this file. */
export function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-white/60"
    >
      <span className="hidden size-9 items-center justify-center rounded-lg bg-orange-700 sm:flex">
        <Wrench className="size-5 text-white" aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight text-white">{SITE_NAME}</span>
        <span className="mt-0.5 text-xs font-semibold tracking-widest text-orange-100 uppercase">
          {SHOP_NAME}
        </span>
      </span>
    </Link>
  );
}
