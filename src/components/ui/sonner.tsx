"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-center"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success-700" />,
        info: <InfoIcon className="size-4 text-info-700" />,
        warning: <TriangleAlertIcon className="size-4 text-warning-700" />,
        error: <OctagonXIcon className="size-4 text-danger-700" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "rounded-xl! border-gray-200! bg-white! text-gray-900! shadow-lg!",
          description: "text-gray-600!",
          actionButton:
            "rounded-lg! bg-orange-700! font-semibold! text-white! hover:bg-orange-800!",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
