import AttendanceChart from "@/components/AttendanceChart";
import Calendar from "@/components/Calendar";
import CountChart from "@/components/CountChart";
import Progress from "@/components/Progress";
import UserCard from "@/components/UserCard";
import Welcome from "@/components/Welcome";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/*LEFT*/}
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        {/*USER CARDS*/}
        <div className="flex gap-4 justify-between flex-wrap flex-col">
          <Welcome type="student" />
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
};

export default AdminPage;
