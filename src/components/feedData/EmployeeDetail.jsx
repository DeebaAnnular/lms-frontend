"use client"
import React, {  useEffect, useState } from 'react'
import EmployeeForm from "./EmployeeDetailForm"
import LeaveSettings from "./leaveSettings"
import { getEmp_detail_by_id } from '../../actions'

const EmployeeDetail = ({ id }) => {
  
    const [empDetails, setEmpDetails] = useState([]);
    const[gender,setGender] = useState("");
    console.log("id",id);

    useEffect(() => {
        
        const getempldetails = async () => {

            const resData = await getEmp_detail_by_id(id);
            console.log("resdata",resData)
            setGender(resData.gender)
            
            setEmpDetails(resData)
            
        }

        getempldetails();
        
    }, [gender]) 

    return (
        <div>
            <div className="personal-data bg-white rounded-none px-5 py-3">
                <p className='text-[16px] font-bold mb-2'>Edit Employee Details</p>
                
                <EmployeeForm resData={empDetails} id={id} setGender={setGender} gender={gender}/>
                {/* <div className="personal-data w-full bg-white rounded-md px-5 py-6 mt-[-10px]">
                    <p className='text-[20px] font-bold mb-2'>Leave Allocation</p>
                    <LeaveSettings id={id} gender={empDetails.gender} />
                </div> */}
            </div>
        </div>
    )
}

export default EmployeeDetail