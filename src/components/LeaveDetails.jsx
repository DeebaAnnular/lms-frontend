import React from "react";

const  LeaveDetails = ({ leaveBalance }) => { 
  return (
    <div className="flex p-5 w-[35%] h-full ">
      <div className=" flex flex-col p-5 w-full h-full gap-5 ">
        <p className=" text-2xl font-medium text-[#06072D] ">Available Leave</p>
        <div className=" w-[60%] h-[5.5rem] border rounded-md  px-3 py-2 flex flex-col items-start justify-center ">
          <p className="py-2 font-semibold text-[#99A0B0]">Earned Leave</p>
          <p>{leaveBalance.earned_leave}</p>
        </div>
        <div className=" w-[60%] h-[5.5rem] border rounded-md  px-3 py-2 flex flex-col items-start justify-center  ">
          <p className="py-2 font-semibold text-[#99A0B0]">Sick Leave</p>
          <p>{leaveBalance.sick_leave}</p>
        </div>
        <div className=" w-[60%] h-[5.5rem] border rounded-md  px-3 py-2 flex flex-col items-start justify-center  ">
          <p className="py-2 font-semibold text-[#99A0B0]">Optional Leave</p>
          <p>{leaveBalance.optional_leave}</p>
        </div>
        {leaveBalance.maternity_leave && (
          <div className=" w-[60%] h-[5.5rem] border rounded-md  px-3 py-2 flex flex-col items-start justify-center  ">
            <p className="py-2 font-semibold text-[#99A0B0]">Maternity Leave</p>
            <p>{leaveBalance.maternity_leave}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveDetails;
