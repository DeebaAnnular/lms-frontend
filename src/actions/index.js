import { useSelector } from 'react-redux';
import { API } from '../config';

 

export const getEmp_details = async () => {
    try {
        const response = await fetch(`${API}/auth/users`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json(); 
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array or handle error as needed
    }
} 


export async function getAllEmpIds() {
    try {
        const res = await fetch(`${API}/auth/users`); // Adjust the API endpoint as needed
        if (!res.ok) {
            throw new Error('Network response was not ok ' + res.statusText);
        }
        const employees = await res.json();
        return employees.map(emp => emp.user_id); // Assuming the API returns an array of employee objects with an `id` field
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array or handle error as needed
    }
}


export const getEmp_detail_by_id = async (id) => {
    try {
        const response = await fetch(`${API}/auth/user/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array or handle error as needed
    }
}


export const getEmp_leave_balence = async (id) => {
    try {

        const response = await fetch(`${API}/leave/leave-balance/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();

        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array or handle error as needed
    }
}

export const getAllOptionalHolidays = async () => {
    try {
        const response = await fetch(`${API}/holiday/optional_holiday`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array or handle error as needed
    }
}

export const getAllCompulsoryHolidays = async () => {
    try {
        const response = await fetch(`${API}/holiday/compulsory_holiday`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array or handle error as needed
    }
}


export const getAll_leave_req = async () => {
    try {
        const response = await fetch(`${API}/leave/get-all-leave-request`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        //testing merge
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array or handle error as needed
    }
}


export const postLeave_req = async (leaveData) => {
    try {
        const response = await fetch(`${API}/leave/request-leave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leaveData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null; // Return null or handle error as needed
    }
}; 
export const updateEmpDetails = async (id, data) => {
    console.log("data",data)
    try {
       const response = await fetch(`${API}/auth/update_user/${id}`, {
        // const response = await fetch(http://localhost:3000/api/auth/update_user/8,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
 
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
  
      const responseData = await response.json();
      return responseData; // Return the fetched data
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  };


export const getLeave_history_by_id = async (id) => {
    try {
        const response = await fetch(`${API}/leave/leave-history/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        //testing merge
        const data = await response.json();

        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array or handle error as needed
    }
}


export const change_user_role = async (role) => {
    try {
        const response = await fetch(`${API}/auth/updateUserRole`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(role),
        })
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText)
        }
        const data = await response.json()
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error)
        return []
    }

}


//task creation 
export const postTask = async (taskData) => {
    try {
        const response = await fetch(`${API}/task/create_task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });
        if (!response.ok) { 
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("error in creating task", error)
    }
}

//get a task by its id
export const getTaskById = async (id) => {
    try {
        const response = await fetch(`${API}/task/get_task_by_id/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null; // Return null or handle error as needed
    }
}

export const getTasksTimeById = async (id) => {
    try {
        const response = await fetch(`${API}/task/get_task_by_id/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null; // Return null or handle error as needed
    }
}



//get all tasks
export const getAllTask = async (user_id) => { 
    const response = await fetch(`${API}/task/get_all_tasks`)
    if (!response.ok) {
        throw new Error('Network response was not ok', response.statusText)
    }
    const data =await response.json() 
    const taskOfCurrentUser = data.filter(item => item.user_id == user_id)
    return taskOfCurrentUser
}


export const editTask = async (id, editedTask) => { 
    try {
        const response = await fetch(`${API}/task/update_task_by_id/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedTask),
        })

        const data = response.json()
        return data;
    } catch (error) {
        console.log("error in editing task", error)
    }
}

export const deleteTask = async (id) => { 
    try {
        const response = await fetch(`${API}/task/delete_task/${id}`, {
            method: 'DELETE', // Use DELETE method for deleting a resource

        });

        if (!response.ok) {
            // If the response status is not OK, throw an error
            throw new Error(`Failed to delete task with status: ${response.status}`);
        }
    } catch (error) {
        console.log("error in deleting task", error);
        throw error; // Rethrow the error for further handling if necessary
    }
};

// Function to fetch all tasks by user ID within a specified date range
export const getAllTaskById = async (userId, startDate, endDate) => {
    try {
        const response = await fetch(`${API}/task/weekly/${userId}?fromDate=${startDate}&toDate=${endDate}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array or handle error as needed
    }
}


export const submitWeeklyTimeSheet = async (data) => { 
    console.log("submitweekyl",data);
        const response = await fetch(`${API}/task/create_weekly_status`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        }
        )

        const resData = await response.json()
        console.log("weeklyresponse",resData)
        return resData
}


export const getWeeklyStatus = async () => {
    try {
        const response = await fetch(`${API}/task/get_weekly_status`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array or handle error as needed
    }
}


export const getAllTaskByIdAdmin = async (weekId, startDate, endDate) => {
     
    try {
        const response = await fetch(`${API}/task/weekly/${localStorage.getItem('emp_id')}?fromDate=${startDate}&toDate=${endDate}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array or handle error as needed
    }
}

    export const handleApprove = async (task_id) => {
        try {
            const response = await fetch(
                `https://lms-api.annularprojects.com:3001/api/task/approve_daily_task`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        approvedStatus: "approved",
                        approvedById: localStorage.getItem("user_id"),
                        taskIds: task_id,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to approve daily task");
            }

            // Update data in state
            const updatedData = data.map((item) => {
                if (item.task_id === task_id) {
                    return {
                        ...item,
                        approved_status: "approved",
                    };
                }
                return item;
            });
            setData(updatedData);

            // router.push("/admin/timesheet");

        } catch (error) {
            console.error("Error approving daily task:", error);
        }
    };

    export const handleReject = async (task_id, user_id) => {
        const rejectComment = window.prompt("Enter your rejection comment");

        try {
            const response = await fetch(
                `https://lms-api.annularprojects.com:3001/api/task/reject_daily_task`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        rejectedStatus: "rejected",
                        rejectedById: user_id,
                        rejectReason: rejectComment,
                        taskIds: task_id,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to reject daily task");
            }

            // Update data in state
            const updatedData = data.map((item) => {
                if (item.task_id === task_id) {
                    return {
                        ...item,
                        approved_status: "rejected",
                    };
                }
                return item;
            });
            setData(updatedData);

            // Optional: Navigate after action
            // router.push("/admin/timesheet");

        } catch (error) {
            console.error("Error rejecting daily task:", error);
        }
    };  


export const getallemp = async () => {
    try {
        const response = await fetch(`${API}/auth/users`);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        return data; // Return the fetched data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return []; // Return an empty array on error
    }
};