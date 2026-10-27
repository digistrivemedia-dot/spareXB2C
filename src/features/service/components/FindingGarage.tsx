"use client";

import { Phone, SearchX, Wrench } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { cancelServiceRequestAction, getServiceRequestAction } from "@/features/service/actions";
import type { ServiceJob, ServiceRequest } from "@/features/service/types";
import { GARAGE_ACCEPT_SECONDS } from "@/features/service/utils";
import { SUPPORT_PHONE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** How often the screen checks the request (and redraws the countdown). */
const POLL_MS = 1000;

type FindingGarageProps = {
  request: ServiceRequest;
  onAccepted: (job: ServiceJob) => void;
  /** Back to the review, to change something or send again. */
  onBack: () => void;
  onRetry: () => void;
};

/**
 * Like waiting for a ride: shows which garage is being asked and how long it has to accept, moving on to the
 * next one until a garage accepts. If none can, offers to try again or call us.
 */
export function FindingGarage({
  request: initial,
  onAccepted,
  onBack,
  onRetry,
}: FindingGarageProps) {
  const [request, setRequest] = useState(initial);
  const [now, setNow] = useState(() => Date.now());
  const [isCancelling, startCancel] = useTransition();
  const isSearching = request.status === "searching";

  useEffect(() => {
    if (!isSearching) return;
    const timer = setInterval(async () => {
      setNow(Date.now());
      const result = await getServiceRequestAction(request.id);
      if (!result.ok) return;
      setRequest(result.request);
      if (result.request.status === "accepted" && result.request.job) {
        onAccepted(result.request.job);
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [isSearching, request.id, onAccepted]);

  function cancel() {
    startCancel(async () => {
      const result = await cancelServiceRequestAction(request.id);
      if (result.ok) onBack();
      else toast.error(result.message);
    });
  }

  if (request.status === "no-garage") {
    return (
      <Card
        aria-label="No garage available"
        className="grid justify-items-center gap-4 py-10 text-center"
      >
        <SearchX className="size-12 text-gray-400" strokeWidth={1.5} aria-hidden />
        <h2 className="text-xl font-semibold text-gray-900">No garage could take it right now</h2>
        <p className="max-w-md text-sm text-gray-600">
          The garages nearby are full for that day. Try again, pick another day, or call us and
          we&apos;ll arrange it.
        </p>
        <div className="grid w-full max-w-sm gap-3">
          <Button size="lg" onClick={onRetry}>
            Try again
          </Button>
          <Button size="lg" variant="secondary" onClick={onBack}>
            Change the day
          </Button>
          <Button asChild size="lg" variant="ghost">
            <a href={`tel:+91${SUPPORT_PHONE}`}>
              <Phone aria-hidden />
              Call us
            </a>
          </Button>
        </div>
      </Card>
    );
  }

  const secondsLeft = request.expiresAt
    ? Math.max(0, Math.ceil((new Date(request.expiresAt).getTime() - now) / 1000))
    : 0;

  return (
    <Card
      aria-label="Finding a garage"
      aria-busy={isSearching}
      className="grid justify-items-center gap-5 py-10 text-center"
    >
      <span className="relative flex size-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-navy-100" aria-hidden />
        <span className="relative flex size-16 items-center justify-center rounded-full bg-navy-700 text-white">
          <Wrench className="size-7" aria-hidden />
        </span>
      </span>
      <div className="grid gap-1">
        <h2 className="text-xl font-semibold text-gray-900">Finding a garage for you</h2>
        <p className="text-sm text-gray-600" aria-live="polite">
          {request.garage ? `Asking ${request.garage.name}` : "Getting your booking ready"}
        </p>
      </div>

      {request.totalGarages > 0 && (
        <div className="grid w-full max-w-xs gap-2">
          <ol aria-label="Garages asked" className="flex justify-center gap-2">
            {Array.from({ length: request.totalGarages }, (_, index) => (
              <li
                key={index}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  index + 1 < request.attempt && "bg-gray-300",
                  index + 1 === request.attempt && "bg-navy-700",
                  index + 1 > request.attempt && "bg-gray-200",
                )}
              >
                <span className="sr-only">
                  Garage {index + 1}
                  {index + 1 === request.attempt ? ", being asked" : ""}
                </span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-gray-500 tabular-nums">
            Garage {request.attempt} of {request.totalGarages} · {secondsLeft}s of{" "}
            {GARAGE_ACCEPT_SECONDS}s to accept
          </p>
        </div>
      )}

      <Button variant="ghost" disabled={isCancelling} onClick={cancel}>
        {isCancelling ? "Cancelling…" : "Cancel"}
      </Button>
    </Card>
  );
}
