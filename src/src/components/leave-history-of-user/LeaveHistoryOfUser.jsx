"use client"

import React, { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './column';
//import Sidebar from '../../../components/sidebar.jsx'

import { getLeave_history_by_id } from '../../actions/index'
import { useSearchParams } from 'next/navigation';


const LeaveHistoryOfUser = () => {


    const [res, setRes] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const Response = await getLeave_history_by_id();
            setRes(Response);
        };

        fetchData();
    }, []);


    return (
        <div className="content-section bg-[rgb(247, 249, 253)] w-full p-5">
            <p className='text-[20px] font-bold'>Leave Status</p>
            <div className="container mx-auto py-5">

                <DataTable columns={columns} data={res.data ? res.data : []} />
            </div>
        </div>
    );
}

export default LeaveHistoryOfUser;
