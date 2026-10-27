import { ArrowUpRight, BadgeIndianRupee, Building2, FileText, UserRound, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginFlow } from "@/features/auth/components/LoginFlow";
import { b2bLoginUrl } from "@/lib/config";

const businessBenefits = [
  { icon: BadgeIndianRupee, text: "Business prices on every part, quotations and credit" },
  { icon: Zap, text: "Quick order by part number, reorder in one click" },
  { icon: FileText, text: "GST invoices and delivery to every branch" },
];

/** Customers log in here with OTP; business members are sent on to SpareX Business. */
export function LoginChooser({ next }: { next: string | null }) {
  return (
    <Tabs defaultValue="customer">
      <TabsList aria-label="Log in as">
        <TabsTrigger value="customer" className="flex-1">
          <UserRound className="mr-2 inline size-4 align-[-2px]" aria-hidden />
          Customer
        </TabsTrigger>
        <TabsTrigger value="business" className="flex-1">
          <Building2 className="mr-2 inline size-4 align-[-2px]" aria-hidden />
          Business
        </TabsTrigger>
      </TabsList>

      <TabsContent value="customer" className="pt-6">
        <LoginFlow next={next} />
      </TabsContent>

      <TabsContent value="business" className="grid gap-6 pt-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">SpareX Business</h1>
          <p className="mt-1 text-sm text-gray-600 md:text-base">
            For garages, workshops, dealers and fleets. Business accounts log in on SpareX Business.
          </p>
        </div>
        <ul className="grid gap-3">
          {businessBenefits.map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-3 text-sm text-gray-700">
              <Icon className="mt-0.5 size-4 shrink-0 text-navy-700" aria-hidden />
              {text}
            </li>
          ))}
        </ul>
        <Button size="lg" asChild>
          <a href={b2bLoginUrl}>
            Log in to SpareX Business
            <ArrowUpRight aria-hidden />
          </a>
        </Button>
      </TabsContent>
    </Tabs>
  );
}
