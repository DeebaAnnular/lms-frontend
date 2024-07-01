
import LeaveSettings from './../../../../components/leaveSettings';
import { getEmp_detail, getEmp_detail_by_id } from '../../../../actions';

const page = async ({ params }) => { 
    console.log(params)
     
    const resData =await  getEmp_detail_by_id(params.id)
     
    const user =  resData[0] 

    const date_of_joining = user.date_of_joining.split(':')[0]
    return (
        <div className="content-sextion w-full flex gap-5 flex-col p-5 h-[calc(100vh-70px)] overflow-x-auto overscroll-y-none">

            <div className="personal-data w-full bg-white rounded-md px-5 py-3 shadow-md" style={{ backgroundColor: 'rgb(247, 249, 253)' }}>
                <p className='text-[20px] font-bold mb-2 '>Employee Details</p>

                <div className='flex gap-5 '>
                    <div className='emp-img w-[20%] min-w-[200px] h-[250px] border-2 '></div>

                    <div className='flex flex-row w-full justify-around'>
                        <div className='h-full flex flex-col  '>
                            <p className='py-[10px]'> <span className='font-bold'>Emp Id :</span>  {user.emp_id}</p>
                            <p className='py-[10px]'> <span className='font-bold'>Name :</span>  {user.emp_name}</p>
                            <p className='py-[10px]'> <span className='font-bold'>Gender :</span>  {user.gender}</p>
                            <p className='py-[10px]'> <span className='font-bold'>Contact :</span>  {user.contact_number}</p>
                             
                        </div>
                        <div className='h-full flex flex-col '>
                            <p className='py-[10px]'> <span className='font-bold'>Designation :</span>  {user.designation}</p>
                            <p className='py-[10px]'> <span className='font-bold'>Date of Joining :</span>  {date_of_joining.split('T')[0]}</p>
                            <p className='py-[10px]'> <span className='font-bold'>Work Location :</span>  {user.work_location}</p>
                        </div>


                    </div>

                </div>



            </div>

            <div className="personal-data w-full bg-white rounded-md px-5 py-3 shadow-md" style={{ backgroundColor: 'rgb(247, 249, 253)' }}>
                <p className='text-[20px] font-bold mb-2 '>Work Experience</p>

                <div className='flex gap-5 '>

                    <div className='flex flex-row w-full justify-around'>
                        <div className='h-full flex flex-col  '>
                            <p className='py-[10px]'> <span className='font-bold'>Emp Id :</span>  {user.emp_id}</p>
                            <p className='py-[10px]'> <span className='font-bold'>Name :</span>  {user.emp_name}</p>
                            <p className='py-[10px]'> <span className='font-bold'>Gender :</span>  {user.gender}</p>
                            <p className='py-[10px]'> <span className='font-bold'>Contact :</span>  {user.contact_number}</p>
                        </div>
                        <div className='h-full flex flex-col '>
                            <p className='py-[10px]'> <span className='font-bold'>Personal Email :</span>  {user.personal_email}</p>
                            <p className='py-[10px]'> <span className='font-bold'>Work E :</span>  {user.company_email}</p>
                            <p className='py-[10px]'> <span className='font-bold'>Blood Group :</span>  {user.gender}</p>
                        </div>
                    </div>

                </div>





            </div>

            <div className="personal-data w-full bg-white rounded-md px-5 py-3 shadow-md" style={{ backgroundColor: 'rgb(247, 249, 253)' }}>
                <p className='text-[20px] font-bold mb-2 '>Leave Settings</p>
                <LeaveSettings  id = {params.id}/>


            </div>

        </div>
    )
}

export default page