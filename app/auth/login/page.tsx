import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import ResendVerificationForm from "./ResendVerificationForm";
import GoogleSignInButton from "@/component/auth/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>

        <p className="mt-2 text-sm text-gray-600">Sign in to continue.</p>

        <div className="mt-8">
          <LoginForm />
          <ResendVerificationForm />
        </div>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleSignInButton />
        </div>
      </section>
    </main>
  );
}
