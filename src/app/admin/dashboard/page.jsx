"use client";
import React, { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './column';
import { API } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import AuthRoute from '../../../HOC/AuthRoute';
import { getallemp } from '../../../actions';

const Page = () => {
    const [emp_list, setEmp_list] = useState([]); 

    useEffect(() => {
        const fetchEmployees = async () => {
            const data = await getallemp();
            setEmp_list(data);
        };
        fetchEmployees();
    }, []); 
console.log("emplist",emp_list);
    return (
        <div className='w-full h-full'>
            <ToastContainer />
            <p className='text-[16px] font-bold'>Employee Details</p>
            <div>
                {console.log("columns",columns)}
                <DataTable columns={columns} setEmp_list={setEmp_list} data={emp_list}/>
            </div>
        </div>
    );
};

export default AuthRoute(Page, ['admin', 'approver']);