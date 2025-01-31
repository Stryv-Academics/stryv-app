import Image from "next/image";

const Appointments = () => {
  return (
    <div className=" p-4 flex-1">
      <div className="flex justify-between items-center">
        <span className="text-[20px] bg-white px-5 py-1 rounded-full text-black-600">
          No upcoming appointments.
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <div className="rounded-2xl p-1 flex-1 mt-4 border border-gray-300">
        <div className="text-[20px] font-semibold my-2 text-gray-400 text-center">
          Let&apos;s change that
        </div>
      </div>
    </div>
  );
};

export default Appointments;
