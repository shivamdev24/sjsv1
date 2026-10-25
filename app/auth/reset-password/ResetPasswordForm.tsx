"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/backend/action/password-reset.action";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("The reset link is invalid or expired.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await resetPasswordAction({ token, password });

        if (result.success) {
          setMessage(result.message);
          setIsComplete(true);
          setPassword("");
          setConfirmPassword("");
        } else {
          setError(result.message);
        }
      } catch {
        setError("Unable to reset your password. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-4">
      {isComplete ? (
        <div className="space-y-4">
          <p role="status" className="text-sm text-green-700">
            {message}
          </p>
          <Link
            href="/auth/login"
            className="inline-block underline underline-offset-4"
          >
            Return to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Use 12–128 characters.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !token}
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
          >
            {isPending ? "Updating password..." : "Reset password"}
          </button>
        </form>
      )}
    </div>
  );
}
