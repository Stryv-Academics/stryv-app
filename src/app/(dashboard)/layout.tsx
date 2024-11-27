import Link from "next/link";
import Menu from "@/components/Menu";
import pullData from "../../components/pullData";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await pullData();
  console.log(userData);
  return (
    <div className="h-screen flex">
      {/* Left */}
      <div className="w-[25%] md:w-[25%] lg:w-[25%] bg-white xlg:w-[25%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <span className="hidden lg:block"></span>
        </Link>
        {/* Need to figure out how to render this */}
        <Menu userData={userData} />
      </div>
      {/* Right */}
      <div className="w-[75%] md:w-[75%] lg:w-[75%] xlg:w-[75%] bg-white overflow-scroll">
        {children}
      </div>
    </div>
  );
}
