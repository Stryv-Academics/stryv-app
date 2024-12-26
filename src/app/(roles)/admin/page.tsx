import AttendanceChart from "@/components/lama/AttendanceChart";
import Calendar from "@/components/lama/Calendar";
import CountChart from "@/components/lama/CountChart";
import Progress from "@/components/lama/Progress";
import UserCard from "@/components/lama/UserCard";
import Welcome from "@/components/lama/Welcome";
import { getUserStrict } from "@/app/auth/server/userHandlers";
import { fetchTableDataSingle } from "@/services/supabase/dataService";
import { Account } from "@/types";

export default async function AdminPage() {
  // Fetch id of authenticated user
  const userID: string = (await getUserStrict()).id;
  console.log("[Admin Page] User ID:", userID);

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
          <div className="flex flex-row">
            <UserCard type="teacher" />
            <UserCard type="parent" />
            <UserCard type="staff" />
          </div>
        </div>
        {/*MIDDLE CHARTS*/}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/*COUNT CHART*/}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/*ATTENDANCE CHART*/}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        {/*BOTTOM CHARTS*/}
        <div className=""></div>
      </div>
      {/*RIGHT*/}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <Progress />
        <Calendar />
      </div>
    </div>
  );
}
