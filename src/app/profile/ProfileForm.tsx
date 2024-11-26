"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [first_name, setFirstname] = useState<string | null>(null);
  const [last_name, setLastname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`first_name, last_name, username`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFirstname(data.first_name);
        setLastname(data.last_name);
        setUsername(data.username);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    first_name,
    last_name,
    username,
  }: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        first_name,
        last_name,
        username,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error("Error details:", error); // Log the detailed error to the console
        throw error; // Throw the error for catch block handling
      }

      alert("Profile updated!");
    } catch (error) {
      console.error("An error occurred:", error); // Log the error
      // Display a more detailed error message to the user
      alert(
        `Error updating the data: ${
          error.message || "An unknown error occurred."
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Your Profile</h2>
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
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            value={first_name || ""}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            value={last_name || ""}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <button
            className="button primary block w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            onClick={() => updateProfile({ first_name, last_name, username })}
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update"}
          </button>
        </div>

        <div>
          <form action="/auth/logout" method="post">
            <button
              className="button block text-gray-500 hover:text-blue-600 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="submit"
            >
              Logout
            </button>
          </form>
          <form action="/student" method="post">
            <button
              className="button block text-gray-500 hover:text-blue-600 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="submit"
            >
              Back to home
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
