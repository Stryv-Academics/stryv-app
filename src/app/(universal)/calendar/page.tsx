import { Account } from "@/types";
import { fetchTableDataSingle } from "@/services/supabase/dataService";
import { getUserStrict } from "@/app/auth/server/userHandlers";
import CalendarView from "@/components/custom/CalendarCard";

export default async function StudentCalendarPage() {
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
            <CalendarView />
        </div>
    );
}
