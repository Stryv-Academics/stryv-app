import fetchTableData from "@/services/userApis";
import AssignType from "./AssignType";
import { createClient } from "@/utils/supabase/server";
import type { Profile } from "@/types/profile";

export default async function Profile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const table = "profiles";
  const fields = ["first_name", "last_name", "username"];
  const userData = await fetchTableData<Profile>({ table, fields });

  return <AssignType user={user} userData={userData} />;
}
