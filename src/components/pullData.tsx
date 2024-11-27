import { createClient } from "@/utils/supabase/server";

export default async function pullData() {
    const supabase = await createClient();
    const { data: userData } = await supabase
        .from("profiles")
        .select("role, first_name, last_name")
        .single();
    return userData;
}