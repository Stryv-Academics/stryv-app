import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Account } from "@/types";
import SVGLogo from "@/components/svg-logo";
import Menu from "./Menu";

interface SidebarProps {
  userData: Account;
}

export default function Sidebar({ userData }: SidebarProps) {
  return (
    <Card className="w-[25%] shadow-lg border-r border-gray-200 flex flex-col shrink-0">
      {/* Logo Section */}
      <div className="p-4 flex items-center justify-center lg:justify-start gap-4">
        <SVGLogo />
        <span className="hidden lg:block font-semibold text-lg text-gray-900">
          Dashboard
        </span>
      </div>
      <Separator />

      {/* Menu Section */}
      <ScrollArea className="grow p-4">
        <Menu userData={userData} />
      </ScrollArea>

      {/* Footer or Additional Links */}
      <div className="p-4">
        <Separator />
        <div className="text-sm text-gray-500 mt-4 text-center">
          &copy; {new Date().getFullYear()} Stryv Academics
        </div>
      </div>
    </Card>
  );
}
