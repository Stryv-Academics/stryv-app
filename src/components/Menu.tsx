import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Calendar",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/list/settings",
        visible: ["admin", "teacher"],
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
        href: "/help",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/phone.png",
        label: "Contact Us",
        href: "/contact",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = ({ type }: { type: string }) => {
  return (
    <div>
      {/* Logo Section */}
      <div className="flex justify-center mt-4 mb-10">
        <Image src="/logo.png" alt="Logo" width={120} height={40} />
      </div>

      <div className="my-2 h-px bg-gray-300" />

      {/* Menu Section */}
      <div className="mt-5 text-sm">
        {menuItems.map((i) => (
          <div className="flex flex-col gap-2" key={i.title}>
            <span className="hidden lg:block text-gray-400 font-light my-4">
              {i.title}
            </span>
            {i.items.map((item) => (
              <Link
                href={item.href || "#"} // Default href to "#" if none is provided
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
        <div className="my-2 h-px bg-gray-300" />

        {otherItems.map((i) => (
          <div className="flex my-5 flex-col gap-2" key={i.title}>
            <span className="hidden lg:block text-gray-400 font-light my-4">
              {i.title}
            </span>
            {i.items.map((item) => (
              <Link
                href={item.href || "#"} // Default href to "#" if none is provided
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="my-4 h-px bg-gray-300" />

      {/* Home Link */}
      <Link
        href={type} // Use the dynamic homeHref passed to the Menu component
        className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2"
      >
        <Image src="/home.png" alt="Home" width={20} height={20} />
        <span className="hidden lg:block">Home</span>
      </Link>

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
          <span className="text-xs leading-3 font-medium">
            Zach Berkenkotter
          </span>
          <span className="text-[10px] text-gray-500">student</span>
          <span className="text-[10px] text-gray-500">...</span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
