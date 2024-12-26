"use client";
import { z } from "zod";
import { validatedAction } from "@/utils/validation/validatedAction";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import config from "@/config";

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data) => {
  const supabase = await createClient();
  const { email, password } = data;

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid credentials. Please try again." };
  }

  // If sign-in is successful, redirect to dashboard
  redirect("/");
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // inviteId: z.string().optional(),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const supabase = await createClient();
  const { email, password } = data;
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  redirect("/");
});

export const signInWithMagicLink = validatedAction(
  // Schema to validate only email input
  z.object({
    email: z.string().email(),
    next: z.string().optional(), // Include 'next' as an optional parameter
  }),
  async (data) => {
    const supabase = await createClient();
    const { email, next } = data;

    // Build redirect URL dynamically with 'next' query parameter
    const redirectTo = `${config.domainName}/api/auth/callback${
      next ? `?next=${encodeURIComponent(next)}` : ""
    }`;
    console.log(`[signInWithMagicLink] Intended redirect URL: ${redirectTo}`);

    // Send magic link for sign-in
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    // Handle errors
    if (error) {
      console.error("Error sending magic link:", error);
      return { error: error.message };
    }

    // Success message
    return { success: "Magic link sent to your email." };
  }
);

export const signInWithGoogle = async (next: string | null) => {
  console.log("[signInWithGoogle] Initiating Google sign-in!");
  const supabase = await createClient();

  try {
    const redirectTo = `${config.domainName}/api/auth/callback${
      next ? `?next=${encodeURIComponent(next)}` : ""
    }`;
    console.log(`[signInWithGoogle] Intended redirect URL: ${redirectTo}`);

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (signInError) {
      throw signInError;
    }
  } catch (error) {
    console.error("[signInWithGoogle] Google sign-in exception:", error);
    return {
      error:
        "[signInWithGoogle] An unexpected error occurred. Please try again.",
    };
  }
  console.log("[signInWithGoogle] Successfully logged in with Google!");
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
};
