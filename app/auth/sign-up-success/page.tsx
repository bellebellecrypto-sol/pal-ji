import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 pb-safe pt-safe">
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Mail className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground">Check your email</h1>
        <p className="mb-8 text-muted-foreground">
          We sent you a confirmation link. Please check your inbox and click the link to activate your account.
        </p>

        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          Go to Login
          <ArrowRight className="h-5 w-5" />
        </Link>

        <p className="mt-8 text-sm text-muted-foreground">
          {"Didn't receive the email? Check your spam folder or "}
          <Link href="/auth/sign-up" className="text-primary">
            try again
          </Link>
        </p>
      </div>
    </div>
  );
}
