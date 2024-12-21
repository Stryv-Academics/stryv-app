"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Extract email and password from formData
  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Attempt to sign in with email and password
  const { data: authData, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    redirect("/error"); // Redirect if there's an authentication error
  }
  revalidatePath("/student", "layout"); // Revalidate cache for the layout
  redirect("/home");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Extract email and password from formData
  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(credentials);

  if (error) {
    redirect("/error"); // Redirect if there's an error during sign-up
  }

  revalidatePath("/student", "layout");
  redirect("/home");
}
