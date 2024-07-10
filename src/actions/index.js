import { API } from '../config';

export const getEmp_details = async () => {
    try {
        const response = await fetch(`${API}/auth/users`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log(data)
        return data; // Return the fetched data
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
            console.log(response)
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("error in creating task", error)
    }
}

//get all tasks
export const getAllTask = async () => {

    const response = await fetch(`${API}/task/get_all_tasks`)
    if (!response.ok) {
        throw new Error('Network response was not ok', response.statusText)
    }
    const data = response.json()
    return data
}


export const editTask = async (id, editedTask) => {
    console.log(editedTask)
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
    console.log(id);
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
        const response = await fetch(`${API}/task/weekly_status`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        }
        )

        const resData = await response.json()
        return resData
}


export const getWeeklyStatus = async () => {
    try {
        const response = await fetch(`${API}/task/weeklyStatuses`);
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