"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { Profile } from "@/types/profile";

export default function ProfileForm({
  user,
  userData,
}: {
  user: User | null;
  userData: Profile;
}) {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState<string>(userData.first_name || "");
  const [lastName, setLastName] = useState<string>(userData.last_name || "");
  const [username, setUsername] = useState<string>(userData.username || "");

  async function updateProfile() {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        first_name: firstName,
        last_name: lastName,
        username: username,
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
        `Error updating the data: ${error.message || "An unknown error occurred."
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
            value={firstName || ""}
            onChange={(e) => setFirstName(e.target.value)}
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
            value={lastName || ""}
            onChange={(e) => setLastName(e.target.value)}
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
            onClick={() => updateProfile()}
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
