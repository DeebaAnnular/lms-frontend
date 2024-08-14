"use client";

import React, { useActionState, useEffect, useState } from "react";
import LeaveForm from "../../../components/leave-form";
import LeaveDetails from "../../../components/LeaveDetails";
import { CgDanger } from "react-icons/cg";

import { getEmp_leave_balence } from "../../../actions";
import { useSelector } from "react-redux";
import { getLeaveBalance } from "../../../services/leaveServices"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Page = () => {
  const user = useSelector((state) => state.user.userDetails);
  const [leaveBalance, setLeaveBalance] = useState([]);

  const fetchLeaveBalanceById = async () => {
    const resData = await getLeaveBalance(user.user_id || null); 
    setLeaveBalance(resData);
  };

  useEffect(() => {
    fetchLeaveBalanceById();
  }, []);

  return <><div className="w-full bg-[#FBF9F9] h-full md:p-3 xl:p-6">
    <ToastContainer/>
    <div className="w-full h-full flex bg-white">
        <LeaveForm  fetchLeaveBalanceById = {fetchLeaveBalanceById}/>
        {leaveBalance ? (
          <LeaveDetails leaveBalance={leaveBalance} />
        ) : (
          <div className="flex items-center py-4">
             {/* <CgDanger className="mr-2" /> */}
            <h3>Leave not Allotted</h3>
            <br/>
            <h3>Please contact Admin</h3>
          </div>
        )}

    </div>

  

  </div>;
  </> 
};

export default Page;

// {
  /* <div className="apply-leave-container w-full p-10">
<div className="leave-balance-cards flex items-center justify-between gap-3">
<div  className='flex w-full gap-4 justify-between w-fll'>
                      <div className="border-2  flex-1 flex flex-col rounded-md shadow-sm items-center p-2 mb-4">
                          <p className='text-[30px]'>{leaveBalance.sick_leave}</p>
                          <p>Sick Leave</p>
                      </div>
                      <div className="border-2  flex-1 flex flex-col rounded-md shadow-sm items-center p-2 mb-4">
                          <p className='text-[30px]'>{leaveBalance.earned_leave}</p>
                          <p>Earned Leave</p>
                      </div>
                      <div className="border-2  flex-1 flex flex-col rounded-md shadow-sm items-center p-2 mb-4">
                          <p className='text-[30px]'>{leaveBalance.optional_leave}</p>
                          <p>Optional Leave</p>
                      </div>
                  </div>
  {/* {leaveBalance.map((item, index) => {

              return (
                 


              );
          })} 
</div>
<div className="form-container w-full border-2 p-4 rounded-md shadow-lg">
  <p className="text-2xl font-bold mb-6">Leave Application</p>
  <LeaveForm fetchLeaveBalanceById={getLeaveBalance(user.user_id)} />
</div>
</div> */
// }
