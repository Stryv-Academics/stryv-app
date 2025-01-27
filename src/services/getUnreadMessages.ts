import { createClient } from "@/utils/supabase/server";

const supabase = await createClient();

const fetchUnreadCounts = async () => {
  const { data, error } = await supabase.rpc('get_conversations_with_unread_info');

  if (error) {
    console.error("Error fetching unread counts:", error);
    return null;
  }
  return data;
};

export default fetchUnreadCounts;