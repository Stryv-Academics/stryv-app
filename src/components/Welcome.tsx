"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";

interface WelcomeProps {
  type: string;
  username?: string;
}

const Welcome = ({ user }: { user: User | null }) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [first_name, setFirstname] = useState<string | null>(null);

  // Fetch the first name from the Supabase database
  const getFirstName = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return; // If there's no user, stop the function
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFirstname(data.first_name); // Update the state with the fetched first name
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  // Fetch the first name when the user changes
  useEffect(() => {
    getFirstName();
  }, [user, getFirstName]);

  // Show a loading state while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="p-4 flex-1">
      <div className="rounded-2xl border border-gray-300 bg-white p-6">
        <div className="flex items-center gap-4">
          <Image
            src="/avatar.png"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome, {first_name || "User"}!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
