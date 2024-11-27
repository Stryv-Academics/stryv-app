import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const UserDataFetcher = () => {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<{
        first_name: string | null;
        last_name: string | null;
        username: string | null;
        role: string | null;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user:", error);
                setError("Error fetching user.");
            } else {
                setUser(data.user);
            }
        } catch (err) {
            setError("Unexpected error occurred while fetching user.");
            console.error(err);
        }
    }, [supabase]);

    const fetchUserData = useCallback(async () => {
        if (!user) {
            setError("No user found.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from("profiles")
                .select(`first_name, last_name, username, role`)
                .eq("id", user.id)
                .single();

            if (error) {
                throw error;
            }

            if (data) {
                setUserData(data);
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            setError("Error loading user data.");
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user, fetchUserData]);

    return {
      loading,
      error,
      user,
      userData,
    };
};

export default UserDataFetcher;
