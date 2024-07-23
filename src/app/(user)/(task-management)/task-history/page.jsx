"use client";

import React, { useEffect, useState } from "react";
import { getWeeklyStatus } from "../../../../actions";
import { DataTable } from "./data-table";
import { useSelector } from "react-redux";

const Page = () => {
    const user = useSelector((state) => state.user.userDetails);
    const [currUserStatus, setCurrUserStatus] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getWeeklyStatus();
            const allStatuses = response.weeklyStatuses;
            setCurrUserStatus(allStatuses.filter((status) => status.user_id === user.user_id));
        };
        fetchData();
    }, []);

    return (
        <div className="w-full h-full">
            <div className="container mx-auto p-6  bg-[#F9F9F9] h-full flex flex-col">
                <div className=" h-full bg-white flex flex-col">
                    <DataTable allData={currUserStatus} userId={user.user_id} />
                </div>
            </div>
        </div>
    );
};

export default Page;

