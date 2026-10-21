"use client";

import { useState, useTransition } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  /** The button that opens the dialog. */
  trigger: React.ReactNode;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** "destructive" for actions that can't be undone, like cancelling a booking. */
  tone?: "default" | "destructive";
  /** Return false to keep the dialog open, for example when the server said no. */
  onConfirm: () => Promise<boolean | void> | boolean | void;
};

/** Asks "are you sure?" before an action, and stays open with the button disabled while it runs. */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  cancelLabel = "Go back",
  tone = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      if ((await onConfirm()) !== false) setIsOpen(false);
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !isPending && setIsOpen(open)}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary" disabled={isPending}>
              {cancelLabel}
            </Button>
          </AlertDialogCancel>
          <Button
            variant={tone === "destructive" ? "destructive" : "default"}
            disabled={isPending}
            aria-busy={isPending}
            onClick={confirm}
          >
            {isPending ? "Please wait…" : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
