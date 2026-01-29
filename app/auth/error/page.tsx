import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 pb-safe pt-safe">
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground">Authentication Error</h1>
        <p className="mb-8 text-muted-foreground">
          {message || "Something went wrong during authentication. Please try again."}
        </p>

        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
