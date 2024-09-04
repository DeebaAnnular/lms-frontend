"use client";
import React, { useEffect, useState } from 'react';
import { DataTable } from "../assetsMaintenanceHistory/data-table";
import { column } from "../assetsMaintenanceHistory/column";
import { getAllAssetsForMaintenance } from '../../../../actions/assetApi';
import { IoSearchOutline } from "react-icons/io5";

const Page = () => {
    const [assetsMaintenanceData, setMaintenanceAssetsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssetsData = async () => {
            const { data, statusCode } = await getAllAssetsForMaintenance();
            console.log("maintanencedata",data);
            if (statusCode === 200) {
                setMaintenanceAssetsData(data);
            } else {
                console.error('Failed to fetch assets maintenance data');
            }
            setLoading(false);
        };

        fetchAssetsData();
    }, []);

    return (
        <div>
            <div className='bg-white h-[62px] flex items-center justify-between px-7'>
                <p className='text-[25px] font-inter'>
                    Assets Maintenance Details
                </p>
                <div className="flex border border-[#DCDCDC] items-center w-[300px] h-[34px]">
                    <IoSearchOutline className='text-[#B1A8A8] text-[30px] ml-2' />
                    <input
                        placeholder="Search"
                        className="searchbar text-black placeholder:text-[#B1A8A8] text-[15px] border-none outline-none pl-2 pr-2"
                    />
                </div>
            </div>
            <div className='bg-white mt-4'>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <DataTable column={column} data={assetsMaintenanceData} />
                )}
            </div>
        </div>
    );
};

export default Page;
