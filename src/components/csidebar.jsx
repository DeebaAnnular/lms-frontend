"use client";

import React from "react"; 
import { usePathname } from "next/navigation"; 
import Link from "next/link";
import { cn } from "../lib/utils";
import Image from "next/image";

export const sidebarLinks = [
    {
        label:"Dashboard",
        route:'/dashboard', 
    },
    {
        label:"Apply Leave",
        route:'/apply-leave', 
    },
    {
        label:"Add Task",
        route:'/add-task'
    },
    {
        label:"Timesheet",
        route:'/timesheet', 
    }
     
]

const Sidebar = () => {
	const pathname = usePathname();
	return (
		<section className="sticky left-0 top-0 flex h-screen w-fit flex-col 
     justify-between bg-blue-300  pt-0  min-w-[224px]"
		>
            <div className="logo h-[70px] py-[10px] relative w-full  object-contain">
                 
                    <Image src='/imgs/logo2.png' alt='logo'  layout="fill" objectFit="contain" className=" h-[60px] w-full mt-[5px] object-contian" />
                 
            </div>
			<div className="flex mt-4 flex-1 flex-col gap-3 ">
				{sidebarLinks.map((link) => {
					const isActive =
						pathname === link.route || pathname.startsWith(link.route);
					return (
						<Link
							href={link.route}
							key={link.label}
							className={cn(
								"flex gap-4 items-center p-4 justify-start",
								{ "bg-white": isActive }
							)}
						>
                             
                            <p className="text-lg font-semibold ">{link.label}</p>
							 
						</Link>
					);
				})}
			</div>
		</section>
	);
};

export default Sidebar;