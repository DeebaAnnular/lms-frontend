"use client";
import React, { useEffect, useState } from 'react';
import { DataTable } from '../assetsHistory/data-table';
import { getAllAssets } from '../../../../actions/assetApi';
import { column } from './column';
import { IoSearchOutline } from "react-icons/io5";

const AssetsHistory = () => {
    const [AssetsDetails, setAssetsDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [filteredAssets, setFilteredAssets] = useState([]); // State for filtered data

    useEffect(() => {
        const fetchAllAssets = async () => {
            const data = await getAllAssets();
            setAssetsDetails(data);
            setFilteredAssets(data); // Initialize filtered data with all assets
        };
        fetchAllAssets();
    }, []);

    useEffect(() => {
        // Filter the assets based on the search query
        
        const filtered = AssetsDetails.filter(asset =>
            asset.asset_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.asset_type.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredAssets(filtered);
    }, [searchQuery, AssetsDetails]); // Re-run the filter when search query or asset details change

    return (
        <div>
            <div className='bg-white h-[62px] flex items-center justify-between px-7'>
                <p className='text-[25px] font-inter'>
                    Assets Details
                </p>
                <div className="flex border border-[#DCDCDC] items-center w-[300px] h-[34px]">
                    <IoSearchOutline className='text-[#B1A8A8] text-[30px] ml-2' />
                    <input
                        placeholder="Search By Asset Type"
                        className="searchbar text-[#B1A8A8] placeholder:text-[#B1A8A8] text-[15px] border-none outline-none pl-2 pr-2"
                        value={searchQuery} // Bind input to searchQuery state
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                    />
                </div>
            </div>
            <div className='bg-white mt-4'>
                <DataTable column={column} data={filteredAssets} /> {/* Pass filtered data to DataTable */}
            </div>
        </div>
    );
};

export default AssetsHistory;
