"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "../lib/utils";
import Image from "next/image";
// icons
import { LuLayoutDashboard } from "react-icons/lu";
import { FaCalendarAlt, FaTasks } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { MdHistory } from "react-icons/md";
import { IoIdCard } from "react-icons/io5";
import { MdLibraryAdd, MdOutlineAppRegistration, MdExpandMore, MdExpandLess } from "react-icons/md";
import { GrVmMaintenance } from "react-icons/gr";

export const sidebarLinks = [
  {
    label: "Employee Management",
    route: "/admin/dashboard",
    icon: <LuLayoutDashboard />,
  },
  {
    label: "Leave Management",
    route: "/admin/leave-approval",
    icon: <FaCalendarAlt />,
  },
  {
    label:"Leave History",
    route:"/admin/leaveHistory",
    icon:<MdHistory/> ,
  },
  {
    label: "Timesheet",
    route: "/admin/timesheet",
    icon: <FaTasks />,
  },
  {
    label: "Add Holidays",
    route: "/admin/holidays",
    icon: <MdLibraryAdd />,
  },
  {
    label: "Assets Management",
    icon: <FaComputer />,
    subLinks: [
      { label: "Assets", route: "/admin/assetsRegistration", icon: <MdOutlineAppRegistration /> },
      // { label: "Assets Details", route: "/admin/assetsHistory", icon: <MdHistory /> },
      { label: "Access Card", route: "/admin/accessCard", icon: <IoIdCard /> },
      // { label: "Access Card Details", route: "/admin/accessCardHistory", icon: <MdHistory /> },
      { label: "Maintenance", route: "/admin/assetsMaintenance", icon: <GrVmMaintenance /> },
      // { label: "Assets Maintenance Details", route: "/admin/assetsMaintenanceHistory", icon: <MdHistory /> },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [showAssetsSubLinks, setShowAssetsSubLinks] = useState(false);

  const toggleAssetsSubLinks = () => setShowAssetsSubLinks(!showAssetsSubLinks);

  return (
    <section className="sticky left-0 top-0 flex h-screen w-full flex-col justify-between bg-[#134572] pt-0">
      <div className="logo h-[85px] py-[20px] relative w-full object-contain">
        <Image
          src="/imgs/logo1.png"
          alt="logo"
          layout="fill"
          objectFit="contain"
          className="h-[75px] w-full mt-[20px] object-contain"
        />
      </div>
      <div className="flex mt-8 flex-1 flex-col gap-1"> {/* Reduced gap */}
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route || pathname.includes(link.route);

          return link.subLinks ? (
            <div key={link.label}>
              <div
                className={cn(
                  "flex gap-4 items-center p-3 justify-start mb-1 text-white hover:bg-white hover:text-black cursor-pointer", // Adjusted padding
                  { "bg-white text-black": isActive || showAssetsSubLinks }
                )}
                onClick={toggleAssetsSubLinks}
              >
                <div>{link.icon}</div>
                <p className="text-[14px]">{link.label}</p>
                <div className="ml-auto">
                  {showAssetsSubLinks ? <MdExpandLess /> : <MdExpandMore />}
                </div>
              </div>
              {showAssetsSubLinks &&
                link.subLinks.map((subLink) => (
                  <Link
                    href={subLink.route}
                    key={subLink.label}
                    className={cn(
                      "flex gap-4 items-center pl-10 py-2 w-[90%] mx-auto mb-1 rounded-full text-white hover:bg-white hover:text-black", // Adjusted width and padding
                      { "bg-white text-black": pathname === subLink.route }
                    )}
                  >
                    <div>{subLink.icon}</div>
                    <p className="text-[13px]">{subLink.label}</p>
                  </Link>
                ))}
            </div>
          ) : (
            <Link
              href={link.route}
              key={link.label}
              className={cn(
                "flex gap-4 items-center p-3 justify-start text-white hover:bg-white hover:text-black", // Adjusted padding
                { "bg-white text-black": isActive }
              )}
            >
              <div>{link.icon}</div>
              <p className="text-[13px]">{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
