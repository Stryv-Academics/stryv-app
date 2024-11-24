import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <Menu />
      </div>
      {/* Right */}
      <div className="w-[75%] md:w-[75%] lg:w-[75%] xlg:w-[75%] bg-white overflow-scroll">
        {children}
      </div>
    </div>
  );
}
