"use client";

import { useActionState } from "react";
import { resendVerificationAction } from "@/backend/action/email-verification.action";
import { initialResendVerificationState } from "@/backend/schemas/auth-state";

export default function ResendVerificationForm() {
  const [state, formAction, pending] = useActionState(
    resendVerificationAction,
    initialResendVerificationState,
  );

  return (
    <form action={formAction} className="mt-6 space-y-3">
      <h2 className="text-lg font-semibold">Resend verification email</h2>

      <label htmlFor="resend-email" className="block text-sm">
        Email address
      </label>

      <input
        id="resend-email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="w-full rounded-lg border px-3 py-2"
        placeholder="you@example.com"
      />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Sending..." : "Resend verification email"}
      </button>

      {state.message && (
        <p aria-live="polite" className="text-sm text-gray-600">
          {state.message}
        </p>
      )}
    </form>
  );
}
