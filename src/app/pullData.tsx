import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const pullData = ({ user }: { user: User | null }) => {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [first_name, setFirstname] = useState<string | null>(null);
    const [last_name, setLastname] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    // Fetch the first name from the Supabase database
    const getData = useCallback(async () => {
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
          .eq("id", user?.id)
          .single();
  
        if (error) {
          throw error;
        }
  
        if (data) {
          setFirstname(data.first_name);
          setLastname(data.last_name);
          setUsername(data.username);
          setRole(data.role);
        }
      } catch (error) {
        alert("Error loading user data!");
      } finally {
        setLoading(false);
      }
    }, [user, supabase]);
  
    useEffect(() => {
      getData();
    }, [user, getData]);
  
    if (loading) {
      return <div>Loading...</div>;
    }  
};
  
const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    const getUser = async () => {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
        console.error("Error fetching user:", error);
        } else {
        setUser(data.user);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return <pullData user={user} />;
};
  
export default App;