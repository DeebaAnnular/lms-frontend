 "use client";

import { useEffect, useState } from "react";
import {
    getEmp_detail,
    getEmp_detail_by_id,
    getLeave_history_by_id,
} from "../../../actions/index";
import LeaveHistoryOfUser from "../../../components/leave-history-of-user/LeaveHistoryOfUser";
import { useSelector } from "react-redux";
import { capitalizeWords } from "../../../utils";

const Page = () => {
    const user = useSelector(state => state.user.userDetails)
    const user_id = user.user_id || null;
    const [resData, setResData] = useState({}); 
    const [user_name, setUser_name] = useState()

    useEffect(() => {
        const fetchData = async () => {
            const resData = await getEmp_detail_by_id(user_id);
            setResData(resData);
            setUser_name(resData.emp_name);
        };
        fetchData();
    }, [user_id]);

    const getInitials = (name) => {
         if(name != undefined){
            return capitalizeWords(name)
            .split(' ')
            .map(word => word.charAt(0))
            .join('');
         }
         
    };

    return (
        <div className="content-sextion w-full flex gap-5 flex-col ">

            {/* personal details or employee details */}
            <div className="w-full flex items-center justify-between bg-white p-[24px]">

                <div className="flex items-center gap-4">
                    <div className="initial_box h-[62px] w-[62px] flex items-center justify-center bg-[#D4FFDE] text-[#00B229] font-semibold text-[22px] rounded-md">
                        {getInitials(resData.emp_name)}
                    </div>
                    <div>
                        <p className="pb-[10px] text-[#4B5563] font-semibold">
                            {capitalizeWords(resData.emp_name)} <span className="text-[14px] font-normal text-[#6B7280]">({resData.gender === "M" ? "Male" : "Female"})</span>
                        </p>
                        <p className="pb-[10px] text-[#4B5563]">
                            <span className="text-[#6B7280] text-[14px] font-medium">Emp Id : </span> {resData.emp_id}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="pb-[10px] text-[#4B5563]">
                        <span className="text-[#6B7280] text-[14px] font-medium">Designation : </span>
                        {capitalizeWords(resData.designation)}
                    </p>
                    <p className="pb-[10px] text-[#4B5563]">
                        <span className="text-[#6B7280] text-[14px] font-medium">Date of Joining : </span>
                        {new Date(resData.date_of_joining).toLocaleDateString("en-CA")}
                    </p>
                </div>

                <div>
                    <p className="pb-[10px] text-[#4B5563]">
                        <span className="text-[#6B7280] text-[14px] font-medium">Work Location : </span>
                        {capitalizeWords(resData.work_location)}
                    </p>
                    <p className="pb-[10px] text-[#4B5563]">
                        <span className="text-[#6B7280] text-[14px] font-medium">Contact : </span>
                        {resData.contact_number}
                    </p>
                </div>    
            </div>

            {/* applied leaves list or leave request status */}
            <LeaveHistoryOfUser id={user_id} />
        </div>
    );
};

export default Page;
