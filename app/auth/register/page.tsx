import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your account.",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>

        <p className="mt-2 text-sm text-gray-600">
          Enter your details to get started.
        </p>

        <div className="mt-8">
          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
