"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import { cancelBookingAction } from "@/features/service/actions";
import { cancelBookingReasons } from "@/features/service/utils";

/** Cancels a booking, with a reason for the garage. Nothing was paid, so there's no refund. */
export function CancelBookingDialog({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  function cancel() {
    startTransition(async () => {
      const result = await cancelBookingAction(jobId, reason);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setOpen(false);
      toast.success("Booking cancelled", { description: "The garage has been told." });
    });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button variant="destructive">Cancel booking</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this booking?</DialogTitle>
          <DialogDescription>
            Nothing has been paid, so there&apos;s nothing to refund.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup value={reason} onValueChange={setReason} aria-label="Reason" className="gap-2">
          {cancelBookingReasons.map((option, index) => (
            <RadioCard key={option} value={option} id={`cancel-booking-${index}`}>
              {option}
            </RadioCard>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button variant="destructive" onClick={cancel} disabled={!reason || isPending}>
            {isPending ? "Cancelling…" : "Cancel booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
