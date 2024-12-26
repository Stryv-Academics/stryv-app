import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Account } from "@/types";
import { fetchTableDataSingle } from "@/services/supabase/dataService";
import { getUserStrict } from "@/app/auth/server/userHandlers";
import Welcome from "@/components/custom/Welcome";
import Tutors from "@/components/custom/Tutors";
import CalendarView from "@/components/custom/CalendarCard";
import Progress from "@/components/custom/Progress";
import Lessons from "@/components/custom/Lessons";

export default async function AdminPage() {
  // Fetch id of authenticated user
  const userID: string = (await getUserStrict()).id;
  console.log("[Student Page] User ID:", userID);

  // Fetch user data for UI
  const userData = await fetchTableDataSingle<Account>(
    "accounts",
    ["first_name"],
    "id",
    userID
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <Welcome userData={userData} />

        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="flex justify-between">
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="tutors">Tutors</TabsTrigger>
          </TabsList>

          <TabsContent value="lessons">
            <Lessons />
          </TabsContent>
          <TabsContent value="tutors">
            <Tutors />
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <Progress />
        <CalendarView />
      </div>
    </div>
  );
}
