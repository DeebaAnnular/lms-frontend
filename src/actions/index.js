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


export const getEmp_detail_by_id = async ( id ) => {
    try {
        console.log(id)
        console.log("requested")
        const response = await fetch(`${API}/auth/user/${id}`);
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


export const getLeave_history_by_id = async () => {
    try {
        const response = await fetch(`${API}/leave/leave-history/1`);
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