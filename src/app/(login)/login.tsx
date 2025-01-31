"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  signInWithMagicLink,
  signInWithGoogle,
} from "@/app/auth/client/authHandlers";
import { useActionState, useEffect, useState } from "react";
import { ActionState } from "@/utils/validation/validatedAction";
import SVGLogo from "@/components/svg-logo";
// import { useSearchParams } from "next/navigation";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const [loading, setLoading] = useState<boolean>(false);
  // const searchParams = useSearchParams();
  // const next = searchParams.get("next");
  const [nextParam, setNextParam] = useState(""); // For 'next' query parameter

  // Capture 'next' parameter on client-side
  useEffect(() => {
    const nextValue = new URLSearchParams(window.location.search).get("next");
    setNextParam(nextValue ?? ""); // Set default if 'next' is missing
  }, []); // Only runs once after component mounts

  // Handle google authentication
  const handleGoogleSignIn = async () => {
    setLoading(true);
    console.log("[handleGoogleSignIn] Initiating signInWithGoogle!");
    await signInWithGoogle(nextParam);
    console.log("[handleGoogleSignIn] Handled Google sign-in!");
    setLoading(false);
  };

  // Handle magic link authentication: use the same magic link flow for both sign-in and sign-up
  const [magicLinkState, magicLinkAction, pending] = useActionState<
    ActionState,
    FormData
  >(signInWithMagicLink, { error: "", success: "" });

  return (
    <div className="min-h-[100dvh] bg-linear-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <SVGLogo />
        </div>

        <h1 className="mt-10 text-2xl font-semibold tracking-tight text-center text-gray-900">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-center text-gray-600">
          {mode === "signin"
            ? "Sign in to continue to your account"
            : "Get started with your new account"}
        </p>

        <div className="mt-10">
          {/* Success Message */}
          {magicLinkState?.success ? (
            <div className="p-6 text-center bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">
                Check your email
              </h3>
              <p className="mt-2 text-sm text-green-700">
                We&apos;ve sent you a magic link to sign in to your account.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Magic Link Form */}
              <form action={magicLinkAction} className="space-y-4">
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="px-4 h-12 bg-white rounded-lg border-gray-200 shadow-xs transition-colors focus:border-blue-500 focus:ring-blue-500"
                />

                {/* Hidden Input for 'next' query parameter */}
                <input type="hidden" name="next" value={nextParam} />

                <Button
                  type="submit"
                  className="w-full h-12 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {pending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : mode === "signin" ? (
                    "Continue with Email"
                  ) : (
                    "Sign Up with Email"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="flex absolute inset-0 items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="flex relative justify-center">
                  <span className="px-4 text-sm text-gray-500 bg-linear-to-b from-white to-gray-50">
                    or
                  </span>
                </div>
              </div>

              {/* Google Sign-In Button */}
              <Button
                onClick={handleGoogleSignIn}
                className="w-full h-12 font-medium text-gray-700 bg-white rounded-lg border border-gray-200 shadow-xs transition-all hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="flex justify-center items-center">
                    <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                    </svg>
                    {mode === "signin"
                      ? "Sign in with Google"
                      : "Sign up with Google"}
                  </div>
                )}
              </Button>
            </div>
          )}

          {/* Error Message */}
          {magicLinkState?.error && (
            <div className="mt-4 text-sm text-red-600">
              {magicLinkState.error}
            </div>
          )}

          {/* Link to Switch Modes */}
          <p className="mt-8 text-sm text-center text-gray-600">
            {mode === "signin"
              ? "New to our platform? "
              : "Already have an account? "}
            <Link
              href={mode === "signin" ? "/sign-up" : "/sign-in"}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
