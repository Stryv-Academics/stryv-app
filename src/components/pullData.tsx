import { createClient } from "@/utils/supabase/server";

export default async function pullData(table: string, filter: string[]) {
    const supabase = await createClient();
    const { data: userData } = await supabase
        .from(table)
        .select(filter.join(", ")) 
        .single();
    return userData;
}