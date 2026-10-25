"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/backend/action/auth.action";
import { initialLoginState } from "@/backend/schemas/auth-state";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialLoginState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="login-email"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="login-email"
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
        <div className="flex justify-between">
          <label
            htmlFor="login-password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <Link
            href="/auth/forgot-password"
            className="text-sm underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          placeholder="Your password"
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
        {isPending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
