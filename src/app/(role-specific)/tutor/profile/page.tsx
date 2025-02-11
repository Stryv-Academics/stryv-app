import { getUserStrict } from "@/app/auth/server/userHandlers";
import { fetchTableDataSingle } from "@/services/supabase/dataService";
import { Tutor, User } from "@/types";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const user: User = await getUserStrict();
  const tutorData = await fetchTableDataSingle<Tutor>(
    "tutors",
    [
      "subjects",
      "bio",
      "qualifications",
      "tutoring_approach",
      "tutoring_experience",
      "current_education",
      "location",
    ],
    "id",
    user.id
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {" "}
        {/* Adjusted max width */}
        <ProfileForm user={user} tutorData={tutorData} />
      </div>
    </div>
  );
}
