import Link from "next/link";
import { verifyEmail } from "@/backend/services/email-verification.service";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  console.log("params", params);
  const token = params.token;

  if (!token || typeof token !== "string") {
    return (
      <main className="mx-auto max-w-md p-8">
        <h1 className="text-2xl font-bold">Invalid verification link</h1>
        <p className="mt-3 text-gray-600">
          This verification link is missing or invalid.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-block text-blue-600 underline"
        >
          Go to login
        </Link>
      </main>
    );
  }

  const result = await verifyEmail(token);

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-bold">
        {result.success ? "Email verified" : "Verification unsuccessful"}
      </h1>

      <p className="mt-3 text-gray-600">{result.message}</p>

      <Link
        href="/auth/login"
        className="mt-6 inline-block rounded-lg bg-black px-4 py-2 text-white"
      >
        Continue to login
      </Link>
    </main>
  );
}
