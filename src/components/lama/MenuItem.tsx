import Image from "next/image";
import React from "react";

interface MenuItemProps {
  item: {
    icon: string;
    label: string;
    action: string;
  };
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  return (
    <div className="flex items-center justify-center lg:justify-start text-gray-500 py-2">
      <form method="post" action={item.action || "#"}>
        <button type="submit" className="flex items-center gap-4">
          <Image src={item.icon} alt="" width={20} height={20} />
          <span className="hidden lg:block">{item.label}</span>
        </button>
      </form>
    </div>
  );
};

export default MenuItem;
