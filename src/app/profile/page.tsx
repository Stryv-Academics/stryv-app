import ProfileForm from "./ProfileForm";
import { createClient } from "@/utils/supabase/server";

export default async function Account() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, username")
    .single();

  return <ProfileForm user={user} profile={profile} />;
}
