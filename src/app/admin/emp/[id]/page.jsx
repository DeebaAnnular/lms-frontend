import LeaveSettings from '../../../../components/feedData/leaveSettings';
import { getEmp_detail_by_id,getAllEmpIds} from '../../../../actions';
import RoleSetting from '../../../../components/feedData/RoleSetting';
import { capitalizeWords } from '../../../../utils';

const Page = async ({ params }) => {
    const resData = await getEmp_detail_by_id(params.id);
    // const empids=await getAllEmpIds();
    // console.log("empids",empids);
   
    

    return (
        <div className="content-section w-full flex flex-col">
            <div className="personal-data bg-white rounded-none px-5 py-3">
                <p className='text-[20px] font-bold mb-2'>Employee Details</p>
                <div className='flex  px-5 gap-12 justify-between'>

                    <div className='flex w-full flex-col gap-4 '>
                        <div className='flex flex-col'>
                            <label className='font-bold'>Employee Id </label>
                            <input
                                type="text"
                                value={resData.emp_id}
                                readOnly
                                className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-bold'>Name </label>
                            <input
                                type="text"
                                value={capitalizeWords(resData.emp_name)}
                                readOnly
                                className='mt-1 p-2 border rounded  min-w-[356px] h-[45px] text-[#667085]'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-bold'>Gender </label>
                            <input
                                type="text"
                                value={resData.gender === 'M' ? "Male" :  "Female"}
                                readOnly
                                className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-bold'>Contact </label>
                            <input
                                type="text"
                                value={resData.contact_number}
                                readOnly
                                className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col   gap-4 w-full'>
                        <div className='flex flex-col'>
                            <label className='font-bold'>Designation </label>
                            <input
                                type="text"
                                value={capitalizeWords(resData.designation)}
                                readOnly
                                className='mt-1 p-2 border rounded min-min-w-[356px] h-[45px] text-[#667085]'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-bold'>Date of Joining </label>
                            <input
                                type="text"
                                value={new Date(resData?.date_of_joining).toLocaleDateString("en-CA")}
                                readOnly
                                className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-bold'>Base Location </label>
                            <input
                                type="text"
                                value={capitalizeWords(resData.work_location)}
                                readOnly
                                className='mt-1 p-2 border rounded min-w-[356px] h-[45px] text-[#667085]'
                            />
                        </div>
                        <div className="personal-data bg-white rounded-md">
                            <RoleSetting />
                        </div>
                    </div>
                </div>
            </div>

            <div className='bg-[#FBF9F9] h-[20px]'></div>

            <div className="personal-data w-full bg-white rounded-md px-5 py-3 mt-[-10px]">
                <p className='text-[20px] font-bold mb-2'>Leave Settings</p>
                <LeaveSettings id={params.id} gender={resData.gender} />
            </div>
        </div>
    );
};

export async function generateStaticParams() {
    const empIds = await getAllEmpIds();  
    return empIds.map((id) => ({
        id: id.toString(),
    }));
}

export default Page;

