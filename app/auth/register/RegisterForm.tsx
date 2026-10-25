"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/backend/action/auth.action";
import { initialRegisterState } from "@/backend/schemas/auth-state";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialRegisterState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={128}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          placeholder="At least 12 characters"
        />
      </div>

      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            state.success ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
