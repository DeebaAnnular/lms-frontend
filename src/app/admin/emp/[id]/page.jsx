
import LeaveSettings from '../../../../components/feedData/leaveSettings';
import { getEmp_detail, getEmp_detail_by_id } from '../../../../actions';

import RoleSetting from '../../../../components/feedData/RoleSetting'
import { capitalizeWords } from '../../../../utils';


 

const Page = async ({ params }) => {


 
    const resData = await getEmp_detail_by_id(params.id) 

    

    // const date_of_joining = user.date_of_joining.split(':')[0]
    return (
        <div className="content-sextion w-full flex gap-5 flex-col p-5 h-[calc(100vh-70px)] overflow-x-auto overscroll-y-none">

         <div className="personal-data w-full bg-white rounded-md px-5 py-3 shadow-md" style={{ backgroundColor: 'rgb(247, 249, 253)' }}>
                <p className='text-[20px] font-bold mb-2'>Employee Details</p>
                <div className='flex gap-5'>
                    <div className='emp-img w-[20%] min-w-[200px] h-[250px] border-2'></div>
                    <div className='grid grid-cols-2 w-full gap-5'>
                        <div className='grid grid-cols-1'>
                            <p className='py-2'><span className='font-bold'>Emp Id <span className='ml-2'>:</span></span><span className='ml-2'>{resData.emp_id}</span> </p>
                            <p className='py-2'><span className='font-bold'>Name <span className='ml-4'>:</span></span><span className='ml-2'>{ capitalizeWords(resData.emp_name)}</span> </p>
                            <p className='py-2'><span className='font-bold'>Gender <span className='ml-1'>:</span></span><span className='ml-2'>{resData.gender === 'M' ? "Male" : "Female" }</span> </p>
                            <p className='py-2'><span className='font-bold'>Contact <span className=''>:</span> </span> <span className=''>{resData.contact_number}</span></p>
                        </div>
                        <div className='grid grid-cols-1'>
                            <p className='py-2'><span className='font-bold'>Designation <span className='ml-5'>:</span></span><span className='ml-2'>{capitalizeWords(resData.designation)}</span> </p>
                            <p className='py-2'><span className='font-bold '>Date of Joining <span>:</span></span> <span className='ml-1'> {new Date(resData?.date_of_joining).toLocaleDateString("en-CA")}</span></p>
                            <p className='py-2'><span className='font-bold'>Base Location <span className='ml-2'>:</span></span><span className='ml-2'>{capitalizeWords(resData.work_location)}</span> </p>
                        </div>
                    </div>
                </div>
            </div> 


            {/* setting emplooye role */}
            <div className="personal-data w-full bg-white rounded-md px-5 py-3 shadow-md" style={{ backgroundColor: 'rgb(247, 249, 253)' }}>
                <p className='text-[20px] font-bold mb-2 '>Employe Role</p>
                <RoleSetting />

            </div>

            <div className="personal-data w-full bg-white rounded-md px-5 py-3 shadow-md" style={{ backgroundColor: 'rgb(247, 249, 253)' }}>
                <p className='text-[20px] font-bold mb-2 '>Leave Settings</p>
                <LeaveSettings id={params.id} />


            </div>

        </div>
    )
}

export default Page