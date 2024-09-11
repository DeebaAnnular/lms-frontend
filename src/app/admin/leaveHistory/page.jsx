"use client"
import React, { useEffect, useState } from 'react';
import { getRejectedAndApprovedLeaveList } from '../../../actions';
import { column } from '../../admin/leaveHistory/column';
import { DataTable } from '../leaveHistory/datatable';
import { IoIosSearch } from "react-icons/io";

const LeaveHistory = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Function to format dates to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const data = await getRejectedAndApprovedLeaveList();
        const formattedData = data.map(item => ({
          emp_name: item.emp_name,
          leave_type: item.leave_type,
          from_date: formatDate(item.from_date),
          to_date: formatDate(item.to_date),
          total_days: item.total_days,
          status: item.status
        }));
        setLeaveData(formattedData);
        setFilteredData(formattedData); // Initially show all data
      } catch (error) {
        console.error('Failed to fetch leave data:', error);
      }
    };

    fetchLeaveData();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setFilteredData(leaveData); // Reset to all data when search is cleared
    } else {
      const filtered = leaveData.filter(item =>
        item.emp_name.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div>
      <div className='bg-white h-[62px] flex items-center justify-between px-7'>
        <p className='text-[20px] font-inter'>
          Leave History
        </p>
        <div className="flex border border-[#DCDCDC] items-center w-[300px] h-[34px]">
          <IoIosSearch className='text-[#B1A8A8] text-[20px] ml-2' />
          <input
            placeholder="Search by Employee Name"
            className="searchbar text-black placeholder:text-[#B1A8A8] text-[14px] border-none outline-none pl-2 pr-2"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <DataTable column={column} data={filteredData} />
    </div>
  );
};

export default LeaveHistory;
