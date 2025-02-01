"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Account, Role, Roles } from "@/types";
import Link from "next/link";
import { signOut } from "@/app/auth/client/authHandlers";
import Image from "next/image";

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
        icon: "/message.png",
        label: "Messages",
        action: "/messages",
        visible: [Roles.ADMIN, Roles.TUTOR, Roles.STUDENT, Roles.PARENT],
      },
      {
        icon: "/assignment.png",
        label: "Progress",
        action: "/progress",
        visible: [Roles.ADMIN, Roles.STUDENT, Roles.PARENT],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        action: "/lessons",
        visible: [Roles.ADMIN, Roles.TUTOR],
      },
      {
        icon: "/more.png",
        label: "Resources",
        action: "/resources",
        visible: [Roles.ADMIN, Roles.TUTOR],
      },
      {
        icon: "/profile.png",
        label: "Profile",
        action: "/profile",
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
        action: "",
        visible: [Roles.ADMIN, Roles.TUTOR, Roles.STUDENT, Roles.PARENT],
        isLogout: true,
      },
    ],
  },
];

export default function Menu({ userData }: { userData: Account }) {
  const role = userData.role as Role;
  const fullName = `${userData.first_name ?? "Guest"} ${
    userData.last_name ?? ""
  }`.trim();
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  // Helper function to generate correct URL path
  const getPath = (action: string): string => {
    const globalPages = [
      "/",
      "/calendar",
      "/contact-us",
      "/messages",
      "/progress",
      "/settings",
      "/support",
    ];
    return globalPages.includes(action) ? action : `/${role}${action}`;
  };

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
              .map((item) =>
                item.isLogout ? (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-gray-800 font-medium hover:text-blue-600 hover:bg-gray-100"
                    onClick={async () => await signOut()}
                  >
                    <div className="relative w-5 h-5">
                      <Image
                        src={item.icon}
                        alt={item.label}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <span className="text-sm">{item.label}</span>
                  </Button>
                ) : (
                  <Link key={item.label} href={getPath(item.action)}>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start gap-2 text-gray-800 font-medium hover:text-blue-600 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5">
                          <Image
                            src={item.icon}
                            alt={item.label}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <span className="text-sm">{item.label}</span>
                      </div>
                    </Button>
                  </Link>
                )
              )}
          </div>
        </div>
      ))}

      <Separator className="mt-6 mb-4" />

      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10">
          <Image
            src="/avatar.png"
            alt="Avatar"
            fill
            className="object-contain"
          />
        </div>

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
