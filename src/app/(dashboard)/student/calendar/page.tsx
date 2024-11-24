import Progress from "@/components/Progress";
import Calendar from "@/components/Calendar";
import Welcome from "@/components/Welcome";
import Tutors from "@/components/Tutors";
import Lessons from "@/components/Lessons";

const StudentPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/*RIGHT*/}
      <div className="w-full flex flex-col gap-6">
        <Calendar />
      </div>
    </div>
  );
};

export default StudentPage;
