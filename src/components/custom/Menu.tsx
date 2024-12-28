"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Account, Role, Roles } from "@/types";
import Link from "next/link";
import { signOut } from "@/app/auth/client/authHandlers";

interface MenuItem {
  icon: string;
  label: string;
  action: string;
  visible: Role[];
  isLogout?: boolean; // Optional flag for logout
}

const menuSections = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        action: "/",
        visible: [Roles.ADMIN, Roles.TUTOR, Roles.STUDENT, Roles.PARENT],
      },
      {
        icon: "/calendar.png",
        label: "Calendar",
        action: "/calendar",
        visible: [Roles.ADMIN, Roles.TUTOR, Roles.STUDENT, Roles.PARENT],
      },
      {
        icon: "/profile.png",
        label: "Profile",
        action: "/profile",
        visible: [Roles.ADMIN, Roles.TUTOR, Roles.STUDENT, Roles.PARENT],
      },
      {
        icon: "/message.png",
        label: "Messages",
        action: "/messages",
        visible: [Roles.ADMIN, Roles.TUTOR, Roles.STUDENT, Roles.PARENT],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        action: "/settings",
        visible: [Roles.ADMIN, Roles.TUTOR, Roles.STUDENT, Roles.PARENT],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Support",
        action: "/support",
        visible: [Roles.ADMIN, Roles.TUTOR, Roles.STUDENT, Roles.PARENT],
      },
      {
        icon: "/phone.png",
        label: "Contact Us",
        action: "/contact-us",
        visible: [Roles.ADMIN, Roles.TUTOR, Roles.STUDENT, Roles.PARENT],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        action: "", // No href since it uses a function
        visible: [Roles.ADMIN, Roles.TUTOR, Roles.STUDENT, Roles.PARENT],
        isLogout: true,
      },
    ],
  },
];

export default function Menu({ userData }: { userData: Account }) {
  const role = (userData.role as Role) ?? Roles.STUDENT;
  const fullName = `${userData.first_name ?? "Guest"} ${
    userData.last_name ?? ""
  }`.trim();
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <ScrollArea className="p-4">
      {/* Menu Section */}
      {menuSections.map((section) => (
        <div key={section.title} className="mb-6">
          <h4 className="text-gray-900 font-semibold mb-4 text-base">
            {section.title}
          </h4>
          <div className="space-y-2">
            {section.items
              .filter((item) => item.visible.includes(role))
              .map((item) => (
                <Button
                  key={item.label}
                  asChild={!item.isLogout} // Only use Link for non-logout buttons
                  variant="ghost"
                  className="w-full justify-start gap-2 text-gray-800 font-medium hover:text-blue-600 hover:bg-gray-100"
                  onClick={
                    item.isLogout ? async () => await signOut() : undefined
                  } // Trigger signOut for logout button
                >
                  {item.isLogout ? (
                    <>
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="w-5 h-5"
                      />
                      <span className="text-sm">{item.label}</span>
                    </>
                  ) : (
                    <Link href={item.action}>
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="w-5 h-5"
                      />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  )}
                </Button>
              ))}
          </div>
        </div>
      ))}

      <Separator className="mt-6 mb-4" />

      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <img
          src="/avatar.png"
          alt="Avatar"
          className="rounded-full w-10 h-10"
        />
        <div>
          <p className="text-lg font-semibold leading-tight text-gray-900">
            {fullName}
          </p>
          <p className="text-sm text-gray-600">{displayRole}</p>
        </div>
      </div>
    </ScrollArea>
  );
}
