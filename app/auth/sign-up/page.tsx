"use client";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signup } from "../actions";
import { Palette, Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [touched, setTouched] = useState({ displayName: false, email: false, password: false });

  // Real-time email validation
  useEffect(() => {
    if (touched.email && email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailRegex.test(email) ? "Please enter a valid email" : "");
    } else {
      setEmailError("");
    }
  }, [email, touched.email]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 1) return { score: 1, label: "Weak", color: "bg-destructive" };
    if (score <= 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
    if (score <= 3) return { score: 3, label: "Good", color: "bg-emerald-400" };
    return { score: 4, label: "Strong", color: "bg-emerald-500" };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailError || !email || !password || !displayName) return;
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    await signup(formData);
    setIsLoading(false);
  };

  const isFormValid = displayName && email && password.length >= 6 && !emailError;

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
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, displayName: true }))}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                  placeholder="At least 6 characters"
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
              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="mb-1 flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-colors",
                          level <= passwordStrength.score ? passwordStrength.color : "bg-border"
                        )}
                      />
                    ))}
                  </div>
                  <p className={cn(
                    "text-xs font-medium",
                    passwordStrength.score <= 1 ? "text-destructive" :
                    passwordStrength.score <= 2 ? "text-amber-500" : "text-emerald-500"
                  )}>
                    {passwordStrength.label} password
                  </p>
                </div>
              )}
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
