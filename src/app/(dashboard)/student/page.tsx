import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import Progress from "@/components/Progress";
import Calendar from "@/components/Calendar";
import Appointments from "@/components/Appointments";
import Welcome from "@/components/Welcome";
import Tutors from "@/components/Tutors";

const StudentPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/*LEFT*/}
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        {/*USER CARDS*/}
        <div className="flex gap-4 justify-between flex-wrap flex-col">
          <Welcome type="student" />
          <Appointments />
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
};

export default StudentPage;
