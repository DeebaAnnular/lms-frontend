"use client";
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { getAll_leave_req, getEmp_leave_balence } from '../../../actions';
import LeaveReqTable from '../../../components/LeaveReqTable';
import { API } from '../../../config/index';
import { capitalizeWords, replaceUnderscore } from '../../../utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { IoIosSearch } from "react-icons/io";

const Page = () => {
    const [leavedata, setLeaveData] = useState([]); // State to store leave requests
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [rejectionReason, setRejectionReason] = useState(''); // State for rejection reason
    const [currentLeaveId, setCurrentLeaveId] = useState(null); // State to store current leave ID for rejection
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLeaveData, setFilteredLeaveData] = useState([]); // State to store filtered leave requests

    const fetchLeaveData = async () => {
        const data = await getAll_leave_req();
        setLeaveData(data);
        setFilteredLeaveData(data);
    };

    useEffect(() => {
        fetchLeaveData();
    }, []); 

    useEffect(() => {
        // Filter leave data based on search query
        const filteredData = leavedata.filter((data) =>
            data.emp_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredLeaveData(filteredData);
    }, [searchQuery, leavedata]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
        const year = date.getFullYear(); // Get full year
        return `${day}-${month}-${year}`; // Return in dd-mm-yyyy format
    };

    const handleApproveClick = async (leaveRequestId) => {

        try {
            const response = await fetch(`${API}/leave/update-leave-status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leave_request_id: leaveRequestId, status: 'approved' }),
            });
            const data = await response.json();
            // alert("Leave Approved Successfully");
            toast.success("Leave Approved Successfully");
            fetchLeaveData();
        } catch (error) {
            // console.error('Error approving leave request:', error);
            toast.error("Error approving leave request:", error);
        }
    };

    const handleRejectClick = (leaveRequestId) => {
        setCurrentLeaveId(leaveRequestId); // Set the current leave ID
        setIsModalOpen(true); // Open the modal
    };

    const handleSubmitRejection = async () => {
        if (rejectionReason) {
            await fetch(`${API}/leave/update-leave-status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leave_request_id: currentLeaveId, status: 'rejected', reason: rejectionReason }),
            });
            toast.success("Leave Rejected Successfully");
            fetchLeaveData();
            setIsModalOpen(false); // Close the modal
            setRejectionReason(''); // Reset the reason
        }
    };

    // const handleNextPage = () => {
    //     setCurrentPage((prevPage) => prevPage + 1);
    // };

    // const handlePrevPage = () => {
    //     setCurrentPage((prevPage) => prevPage - 1);
    // };

    // Calculate start and end indexes based on currentPage
    // const startIndex = (currentPage - 1) * 5;
    // const endIndex = startIndex + 5;

    return (
        <main className='overflow-hidden mx-auto '>
            {/* Modal for rejection reason */}
            {isModalOpen && (
                <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="modal-content bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Enter Reason for Rejection</h2>
                        <textarea 
                            className="w-full h-24 border border-gray-300 rounded-md p-2 mb-4 resize-none"
                            value={rejectionReason} 
                            onChange={(e) => setRejectionReason(e.target.value)} 
                            placeholder="Type your reason here..."
                        />
                        <div className="flex justify-end">
                            <button 
                                className="bg-black text-white rounded-md px-4 py-2 mr-2"
                                onClick={handleSubmitRejection}
                            >
                                Submit
                            </button>
                            <button 
                                className="bg-gray-300 text-black rounded-md px-4 py-2"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
            <div className='min-w-[400px]  '>
            <div className='bg-white h-[62px] flex items-center justify-between px-7'>
                <p className='text-[25px] font-inter'>
                    Leave Request
                </p>
                <div className="flex border border-[#DCDCDC] items-center w-[300px] h-[34px]">
                    <IoIosSearch className='text-[#B1A8A8] text-[30px] ml-2' />
                    <input
                            placeholder="Search by employee name"
                            className="searchbar text-[#B1A8A8] placeholder:text-[#B1A8A8] text-[15px] border-none outline-none pl-2 pr-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                </div>
            </div>
                <div className='min-w-[350px] rounded-lg p-3'>
                    <div className="bg-white mt-2  p-5 overflow-clip">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[800px] table-fixed">
                                <TableHeader className='bg-[#F7F7F7] h-[60px]'>
                                    <TableRow className=' text-[16px] font-bold text-[#333843]'>
                                        <TableHead className="w-[100px] text-[16px] font-bold text-[#333843]">S.No</TableHead>
                                        <TableHead className='w-[200px] text-[16px] font-bold text-[#333843]'>Name</TableHead>
                                        <TableHead className='w-[200px] text-[16px] font-bold text-[#333843]'>Leave Type</TableHead>
                                        <TableHead className='w-[150px] text-[16px] font-bold text-[#333843]'>From Date</TableHead>
                                        <TableHead className='w-[150px] text-[16px] font-bold text-[#333843]'>To Date</TableHead>
                                        <TableHead className='w-[150px] text-[16px] font-bold text-[#333843]'>Total Count</TableHead>
                                        <TableHead className='w-[200px] text-[16px] font-bold text-[#333843] text-center'>Action</TableHead> 

                                    </TableRow>
                                </TableHeader>
                                <TableBody className='text-[#667085]'>
                                {filteredLeaveData.length > 0 ? (
                                        filteredLeaveData.map((data, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell>{capitalizeWords(data.emp_name)}</TableCell>
                                                <TableCell>{capitalizeWords(data.leave_type === 'optional_leave' ? 'optional holiday' : replaceUnderscore(data.leave_type))}</TableCell>
                                                <TableCell>{formatDate(data.from_date)}</TableCell>
                                                <TableCell>{formatDate(data.to_date)}</TableCell>
                                                <TableCell>{data.total_days}</TableCell>
                                                <TableCell className='flex gap-5'>
                                                    <p className='text-red-500 cursor-pointer' onClick={() => handleRejectClick(data.leave_request_id)}>Reject</p>
                                                    <p onClick={() => handleApproveClick(data.leave_request_id)} className='text-green-500 cursor-pointer'>
                                                        Approve
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-4">
                                                No records found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>

                            </Table>
                        </div>
                        {/* <div className="flex w-full justify-end gap-2 mt-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`flex items-center justify-center h-[40px] w-[40px] bg-[#D9D9D9] border-2 border-[#EAEBF1]'  ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="logo h-[12px] relative w-[12px]  object-contain"   >

                                    <Image src='/imgs/left-arrow.svg' alt='logo' layout="fill" objectFit="contain" className=" h-[24px] w-[24px] object-contian" />

                                </div>
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={endIndex >= leavedata.length}
                                className={`flex items-center justify-center h-[40px] w-[40px] bg-[#D9D9D9] border-2 border-[#EAEBF1]'  ${endIndex >= leavedata.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="logo h-[12px] relative w-[12px]  object-contain"   >

                                    <Image src='/imgs/right-arrow.svg' alt='logo' layout="fill" objectFit="contain" className=" h-[24px] w-[24px] object-contian" />

                                </div>
                            </button>

                        </div> */}
                    </div>

                </div>
            </div>
        </main>
    );
}

export default Page;