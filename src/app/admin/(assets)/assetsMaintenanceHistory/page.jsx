import React, { useEffect, useState } from 'react';
import { DataTable } from "../assetsMaintenanceHistory/data-table";
import { column } from "../assetsMaintenanceHistory/column";
import { getAllAssetsForMaintenance } from '../../../../actions/assetApi';
import { IoSearchOutline } from "react-icons/io5";

const Page = () => {
    const [assetsMaintenanceData, setMaintenanceAssetsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAssetsData = async () => {
            const { data, statusCode } = await getAllAssetsForMaintenance();
            if (statusCode === 200) {
                setMaintenanceAssetsData(data);
                setFilteredData(data);
            } else {
                console.error('Failed to fetch assets maintenance data');
            }
            setLoading(false);
        };
        fetchAssetsData();
    }, []);

    useEffect(() => {
        const results = assetsMaintenanceData.filter(asset =>
            asset && asset.asset_no && asset.asset_no.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(results);
    }, [searchTerm, assetsMaintenanceData]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <div className='bg-white h-[62px] flex items-center justify-between px-7'>
                <div className="flex border ml-auto border-[#DCDCDC] items-center w-[300px] h-[34px]">
                    <IoSearchOutline className='text-[#B1A8A8] text-[20px] ml-2' />
                    <input
                        placeholder="Search by Asset No"
                        className="searchbar text-black placeholder:text-[#B1A8A8] text-[13px] border-none outline-none pl-2 pr-2"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className='bg-white mt-4'>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <DataTable column={column} data={filteredData} />
                )}
            </div>
        </div>
    );
};

export default Page;