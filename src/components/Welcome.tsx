import Image from "next/image";

const Logo = ({ type }: { type: string }) => {
  return (
    <div className="rounded-2xl bg-gray-100 p-5 flex-1">
      <h1 className="text-[20px] text-start font-semibold">
        Welcome, zach.berk!
      </h1>
    </div>
  );
};

export default Logo;
