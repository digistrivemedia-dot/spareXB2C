"use client";

import { useState } from "react";

import { MobileStep } from "@/features/auth/components/MobileStep";
import { OtpStep } from "@/features/auth/components/OtpStep";
import type { OtpRequest } from "@/features/auth/types";

/** Mobile number, then the OTP. Logging in and signing up are the same flow. */
export function LoginFlow({ next }: { next: string | null }) {
  const [mobile, setMobile] = useState("");
  const [request, setRequest] = useState<OtpRequest | null>(null);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
          {request ? "Verify your number" : "Log in or sign up"}
        </h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">
          {request
            ? "We sent you a code by SMS."
            : "Use your mobile number. We'll send you a one-time code."}
        </p>
      </div>

      {request ? (
        <OtpStep
          mobile={mobile}
          request={request}
          next={next}
          onChangeNumber={() => setRequest(null)}
        />
      ) : (
        <MobileStep
          defaultMobile={mobile}
          onSent={(sentTo, otpRequest) => {
            setMobile(sentTo);
            setRequest(otpRequest);
          }}
        />
      )}

      <p className="rounded-lg bg-info-50 px-3 py-2 text-sm text-info-700">
        Demo: any 10-digit mobile number and any 6-digit code will work (000000 shows the wrong-code
        message). Use 98450 12345 to see Arjun&apos;s account.
      </p>
    </div>
  );
}
