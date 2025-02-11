import Image from "next/image";
import MenuItem from "./MenuItem";
import SVGLogo from "@/components/svg-logo"; // Company's SVG Logo Component
import { Account } from "@/types";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        action: "/",
        visible: ["admin", "tutor", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Calendar",
        action: "/calendar",
        visible: ["admin", "tutor", "student", "parent"],
      },
      {
        icon: "/profile.png",
        label: "Profile",
        action: "/profile",
        visible: ["admin", "tutor", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        action: "/messages",
        visible: ["admin", "tutor", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        action: "/settings",
        visible: ["admin", "tutor", "student", "parent"],
      },
    ],
  },
];

const otherItems = [
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Help/FAQ",
        action: "/help",
        visible: ["admin", "tutor", "student", "parent"],
      },
      {
        icon: "/phone.png",
        label: "Contact Us",
        action: "/contact",
        visible: ["admin", "tutor", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        action: "/auth/logout",
        visible: ["admin", "tutor", "student", "parent"],
      },
    ],
  },
];

export default function Menu({ userData }: { userData: Account }) {
  const role = userData.role ?? "student";
  const firstName = userData.first_name ?? "Guest";
  const lastName = userData.last_name ?? "";

  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="p-4 bg-white shadow-lg h-full">
      {/* Logo Section */}
      <div className="flex justify-center mt-4 mb-10">
        <SVGLogo /> {/* Company's SVG Logo */}
      </div>

      <div className="my-2 h-px bg-gray-300" />

      {/* Menu Section */}
      <div className="mt-5 text-sm">
        {menuItems.map((i) => (
          <div className="flex flex-col gap-2" key={i.title}>
            <span className="hidden lg:block text-gray-400 font-light my-4">
              {i.title}
            </span>
            {i.items
              .filter((item) => item.visible.includes(role ?? ""))
              .map((item) => (
                <MenuItem key={item.label} item={item} />
              ))}
          </div>
        ))}
        <div className="my-2 h-px bg-gray-300" />

        {otherItems.map((i) => (
          <div className="flex my-5 flex-col gap-2" key={i.title}>
            <span className="hidden lg:block text-gray-400 font-light my-4">
              {i.title}
            </span>
            {i.items
              .filter((item) => item.visible.includes(role ?? ""))
              .map((item) => (
                <MenuItem key={item.label} item={item} />
              ))}
          </div>
        ))}
      </div>

      <div className="my-4 h-px bg-gray-300" />

      {/* Profile Section */}
      <div className="flex items-center gap-4 justify-start w-full mt-5">
        <Image
          src="/avatar.png"
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col items-start">
          <span className="text-xs leading-3 font-medium">{fullName}</span>
          <span className="text-[10px] text-gray-500">{displayRole}</span>
          <span className="text-[10px] text-gray-500">...</span>
        </div>
      </div>
    </div>
  );
}
