"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, Account } from "@/types";
import { Button } from "@/components/ui/button";

export default function AccountForm({
  user,
  userData,
}: {
  user: User;
  userData: Account;
}) {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState<string>(userData.first_name || "");
  const [lastName, setLastName] = useState<string>(userData.last_name || "");
  const [username, setUsername] = useState<string>(userData.username || "");

  async function updateProfile() {
    try {
      setLoading(true);

      const { error } = await supabase.from("accounts").upsert({
        id: user?.id as string,
        first_name: firstName,
        last_name: lastName,
        username: username,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error("Error details:", error);
        throw error;
      }

      alert("Profile updated!");
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-linear-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Your Profile
        </h2>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            id="email"
            type="text"
            value={user?.email}
            disabled
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-600"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName || ""}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-600"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName || ""}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <Button
          onClick={() => updateProfile()}
          disabled={loading}
          className="w-full h-12 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? "Loading ..." : "Update"}
        </Button>

        <div className="mt-6 space-y-4">
          <form action="/auth/logout" method="post">
            <Button
              type="submit"
              variant="outline"
              className="w-full h-12 font-medium text-gray-700 bg-white rounded-lg border border-gray-200 shadow-xs transition-all hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Logout
            </Button>
          </form>
          <form action="/student" method="post">
            <Button
              type="submit"
              variant="outline"
              className="w-full h-12 font-medium text-gray-700 bg-white rounded-lg border border-gray-200 shadow-xs transition-all hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to home
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
