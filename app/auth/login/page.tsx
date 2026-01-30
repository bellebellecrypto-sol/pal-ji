"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "../actions";
import { Palette, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

  // Real-time email validation
  useEffect(() => {
    if (touched.email && email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailRegex.test(email) ? "Please enter a valid email" : "");
    } else {
      setEmailError("");
    }
  }, [email, touched.email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailError || !email || !password) return;
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    await login(formData);
    setIsLoading(false);
  };

  const isFormValid = email && password && !emailError;

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
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to sync your palettes</p>
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
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className={cn(
                  "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors",
                  emailError ? "text-destructive" : "text-muted-foreground"
                )} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full rounded-xl border bg-card py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2",
                    emailError 
                      ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
                      : "border-border focus:border-ring focus:ring-ring/20"
                  )}
                />
              </div>
              {emailError && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {emailError}
                </p>
              )}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-12 text-foreground placeholder:text-muted-foreground transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold transition-all active:scale-[0.98]",
                isFormValid 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Continue without account */}
          <Link
            href="/"
            className="block w-full rounded-xl border border-border bg-card py-3.5 text-center font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98]"
          >
            Continue without account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 pt-4 text-center">
        <p className="text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/auth/sign-up" className="font-semibold text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
