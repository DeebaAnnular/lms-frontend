"use client";
import React, { useState, useEffect } from 'react';
import { DataTable } from '../accessCardHistory/data-table';
import { column } from '../accessCardHistory/column';
import { getAllAccessCardDetails } from '../../../../actions/assetApi';
import { IoSearchOutline } from "react-icons/io5";

const AccessCardHistory = () => {
    const [AccessCardDetails, setAccessCardDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDetails, setFilteredDetails] = useState([]);

    useEffect(() => {
        const fetchAllAccessCardDetails = async () => {
            const data = await getAllAccessCardDetails();
            // console.log("historydata",data.data);
            setAccessCardDetails(data.data);
            setFilteredDetails(data.data); // Initialize filtered data with all details
        };
        fetchAllAccessCardDetails();
    }, []);
console.log("data: ",filteredDetails)
    useEffect(() => {
        // Filter the data based on the search term
        const filteredData = AccessCardDetails.filter((item) =>
            item.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.emp_id.toString().includes(searchTerm)
        );
        setFilteredDetails(filteredData);
    }, [searchTerm, AccessCardDetails]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <div>
                <div className='bg-white h-[62px] flex items-center justify-between px-7'>
                    <div className="flex border ml-auto border-[#DCDCDC] items-center w-[300px] h-[34px]">
                        <IoSearchOutline className='text-[#B1A8A8] text-[20px] ml-2' />
                        <input
                            placeholder="Search by Name or Employee ID"
                            className="searchbar text-black placeholder:text-[#B1A8A8] w-full text-[12px] border-none outline-none pl-2 pr-2"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <div className='bg-white mt-4'>
                    <DataTable column={column} data={filteredDetails} />
                </div>
            </div>
        </div>
    );
};

export default AccessCardHistory;
