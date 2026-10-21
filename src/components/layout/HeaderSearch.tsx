import { Search } from "lucide-react";
import Form from "next/form";
import { Suspense } from "react";

import { SearchInput } from "@/components/layout/SearchInput";
import { Input } from "@/components/ui/input";

const inputProps = {
  id: "site-search",
  name: "q",
  type: "search",
  enterKeyHint: "search",
  placeholder: "Search parts",
  className: "pl-10",
} as const;

export function HeaderSearch({ className }: { className?: string }) {
  return (
    <Form action="/products" role="search" className={className}>
      <label htmlFor="site-search" className="sr-only">
        Search parts
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-500"
          aria-hidden
        />
        {/* Reading the URL makes the current query dynamic, so an empty box shows until it is known. */}
        <Suspense fallback={<Input {...inputProps} />}>
          <SearchInput {...inputProps} />
        </Suspense>
      </div>
    </Form>
  );
}
