import { UserRound } from "lucide-react";
import Link from "next/link";

import { HeaderAction } from "@/components/layout/HeaderAction";
import { AccountMenu } from "@/features/account/components/AccountMenu";
import { getSession } from "@/features/auth/session";

export async function HeaderAccount() {
  const session = await getSession();
  if (session) return <AccountMenu user={session.user} />;

  return (
    <HeaderAction asChild>
      <Link href="/login" aria-label="Log in">
        <UserRound className="size-6" aria-hidden />
        <span className="hidden lg:inline">Log in</span>
      </Link>
    </HeaderAction>
  );
}
