"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "../lib/utils";
import Image from "next/image";
//icons
import { LuLayoutDashboard } from "react-icons/lu";
import { FaCalendarAlt } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import { FaHistory } from "react-icons/fa";

export const sidebarLinks = [
    {
        label: "Employee Management",
        route: '/admin/dashboard',
        icon: <LuLayoutDashboard />
    },
    {
        label: "Leave Management",
        route: '/admin/leave-approval',
        icon: <FaCalendarAlt />
    },
    {
        label: "Timesheet",
        route: '/admin/timesheet',
        icon: <FaTasks />
    },
    {
        label: "Add Holidays",
        route: '/admin/holidays',
        icon: < MdLibraryAdd />
    }

]

const Sidebar = () => {
    const pathname = usePathname();
    return (
        <section className="sticky left-0 top-0 flex h-screen w-full flex-col justify-between bg-[#134572]  pt-0"
        >
            <div className="logo h-[85px] py-[20px] relative w-full  object-contain">

                <Image src='/imgs/logo1.png' alt='logo' layout="fill" objectFit="contain" className=" h-[85px] w-full mt-[20px] object-contian" />

            </div>
            <div className="flex mt-8 flex-1 flex-col gap-3   ">
                {sidebarLinks.map((link) => {
					const isActive =
						pathname === link.route || pathname.includes(link.route);
					return (
						<Link
							href={link.route}
							key={link.label}
							className={cn(
								"flex gap-4 items-center p-4 justify-start text-white  hover:bg-white hover:text-black ",
								{ "bg-white text-black": isActive }
							)}
						>
                             <div>{link.icon}</div>
                            <p className="text-[16px] ">{link.label}</p>
							 
						</Link>
					);
				})}
            </div>
        </section>
    );
};

export default Sidebar;