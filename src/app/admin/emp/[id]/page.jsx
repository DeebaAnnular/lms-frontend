import { getEmp_detail_by_id, getAllEmpIds} from "../../../../actions"
import EmployeeForm from "../../../../components/feedData/EmployeeDetailForm";
import LeaveSettings from "../../../../components/feedData/leaveSettings";
import { ToastContainer, toast } from "react-toastify";


const Page = async ({ params }) => {
    const id = params.id;

    const resData = await getEmp_detail_by_id(params.id);

    return (
        <div className="content-section w-full flex flex-col">
            <ToastContainer />
            <div className="personal-data bg-white rounded-none px-5 py-3">
                <p className='text-[20px] font-bold mb-2'>Employee Details</p>
                <EmployeeForm resData={resData} id = {params.id}/>
                <div className="personal-data w-full bg-white rounded-md px-5 py-3 mt-[-10px]">
                    <p className='text-[20px] font-bold mb-2'>Leave Settings</p>
                    <LeaveSettings id={id} gender={resData.gender} />
                </div>
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

export default Page;