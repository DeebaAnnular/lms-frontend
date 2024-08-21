import { getEmp_detail_by_id, getAllEmpIds } from "../../../../actions";
import EmployeeDetail from "../../../../components/feedData/EmployeeDetail";
import { ToastContainer, toast } from "react-toastify";

const Page = async ({ params }) => {
  return (
    <div className="content-section w-full flex flex-col ">
      <ToastContainer />
       <EmployeeDetail id={params.id} />
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
