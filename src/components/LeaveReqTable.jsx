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
