"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "../lib/utils";
import Image from "next/image";

// icons
import { LuLayoutDashboard } from "react-icons/lu";
import { FaCalendarAlt } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { BsFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

const sidebarLinks = [
  {
    label: "Leave Management",
    icon: <FaCalendarAlt />,
    subLinks: [
      { label: "Apply Leave", route: '/apply-leave', icon: <FaCalendarAlt /> },
      { label: "Leave History", route: '/dashboard', icon: <LuLayoutDashboard /> }
     
    ]
  },
  {
    label: "Task Management",
    icon: <FaTasks />,
    subLinks: [
      { label: "Add Task", route: '/add-task', icon: <FaTasks /> },
      { label: "Timesheet", route: '/timesheet', icon: <BsFileEarmarkSpreadsheetFill /> },
      { label: "Task History", route: '/task-history', icon: <FaHistory /> }
    ]
  }
];

const Sidebar = () => {
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <section className="sticky left-0 top-0 flex h-screen w-full flex-col justify-between bg-[#134572] pt-0">
      <div className="logo h-[75px] relative w-full object-contain">
        <Image src='/imgs/logo2.png' alt='logo' layout="fill" objectFit="contain" className="h-[75px] w-full mt-[20px] object-contain" />
      </div>
      <div className="flex mt-8 flex-1 flex-col gap-3">
        {sidebarLinks.map((section, index) => {
          const isExpanded = expandedSection === index;
          return (
            <div key={section.label}>
              <button
                onClick={() => toggleSection(index)}
                className="flex gap-4 items-center p-4 justify-between w-full text-white hover:bg-white hover:text-black"
              >
                <div className="flex gap-4 items-center">
                  <div>{section.icon}</div>
                  <p className="text-[14px]">{section.label}</p>
                </div>
                {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
              </button>
              {isExpanded && (
                <div className="ml-4">
                  {section.subLinks.map((link) => {
                    const isActive = pathname === link.route;
                    return (
                      <Link
                        href={link.route}
                        key={link.label}
                        className={cn(
                          "flex gap-4 items-center p-4 pl-10 py-2 justify-start text-white rounded-full mb-1 w-[85%]  hover:bg-white hover:text-black",
                          { "bg-white text-black": isActive }
                        )}
                      >
                        <div>{link.icon}</div>
                        <p className="text-[13px]">{link.label}</p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;