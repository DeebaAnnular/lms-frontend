 "use server"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"
import { IoIosClose } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { RiArrowDropDownLine } from "react-icons/ri";
import { getAll_leave_req } from '../actions/index';


 

const LeaveReqTable = async () => {
    const leavedata =  await getAll_leave_req() 
    console.log(leavedata)
        //         "S.No": "1",
    //          
    //          
    //         "From Date": "2023-10-3",
    //         "To Date": "2023-10-5",
    //         "Total Days": "3",
    //         "Approve": "true",
    //         "Rejected": "False",
    
    // id: 2,
    // user_id: 2,
    // emp_name: 'bala',                           <"Username": "rajesh",
    // from_date: '2024-06-30T18:30:00.000Z',
    // to_date: '2024-07-03T18:30:00.000Z',
    // total_days: 1,                              <"Total Days": "3",
    // leave_type: 'earned_leave',                 <"LeaveType": "casual",
    // status: 'pending',
    // created_at: '2024-06-30T03:28:31.000Z',
    // updated_at: '2024-06-30T03:28:31.000Z',
    // reason: null
    return (
        <div>
            <TableBody>
                {leavedata.map((data, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{data['S.No']}</TableCell>
                        <TableCell>{data.Username}</TableCell>
                        <TableCell>{data.LeaveType}</TableCell>
                        <TableCell>{data['From Date']}</TableCell>
                        <TableCell>{data['To Date']}</TableCell>
                        <TableCell>{data['Total Days']}</TableCell>
                        <TableCell><TiTick className='text-green-500 text-xl' /></TableCell>
                        <TableCell><IoIosClose className='text-red-500 text-2xl' /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </div>
    )
}

export default LeaveReqTable
