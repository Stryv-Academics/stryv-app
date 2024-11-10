import Image from "next/image";

const Progress = () => {
  return (
    <div className="rounded-2xl bg-gray-100 p-4 flex-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-gray-300">
          November 10th, 2024
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-[25px] font-semibold my-4">Progress:</h1>
      <div className="rounded-2xl bg-SkyBlue p-2 flex-1">
        <h1 className="text-[20px] text-center font-semibold my-4">
          You met with your tutor last week!
        </h1>
      </div>
    </div>
  );
};

export default Progress;
