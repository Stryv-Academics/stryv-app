import Lessons from "@/components/lama/Lessons";
import Progress from "@/components/lama/Progress";
import Tutors from "@/components/lama/Tutors";
import Welcome from "@/components/lama/Welcome";
import { getUserStrict } from "@/app/auth/server/userHandlers";
import { fetchTableDataSingle } from "@/services/supabase/dataService";
import { Account } from "@/types";
import Calendar from "react-calendar";

export default async function ParentPage() {
  // Fetch id of authenticated user
  const userID: string = (await getUserStrict()).id;
  console.log("[ParentPage] User ID:", userID);

  // Fetch user data for UI
  const userData = await fetchTableDataSingle<Account>(
    "accounts",
    ["first_name"],
    "id",
    userID
  );

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/*LEFT*/}
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        {/*USER CARDS*/}
        <div className="flex gap-4 justify-between flex-wrap flex-col">
          <Welcome userData={userData} />
          <Lessons />
          <Tutors />
        </div>
      </div>
      {/*RIGHT*/}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <Progress />
        <Calendar />
      </div>
    </div>
  );
}
