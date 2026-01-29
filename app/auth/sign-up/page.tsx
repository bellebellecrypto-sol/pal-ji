"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signup } from "../actions";
import { Palette, Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    await signup(formData);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pb-safe pt-safe">
      {/* Header */}
      <div className="flex flex-1 flex-col justify-center">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Palette className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create account</h1>
            <p className="mt-2 text-muted-foreground">Join pal and sync across devices</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-center text-sm text-destructive">
              {decodeURIComponent(error)}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-foreground">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 pt-4 text-center">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
