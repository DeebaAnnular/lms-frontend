import axios from "axios";

const publicAPI = axios.create({
    // baseURL:"http://13.201.79.49:9091" 
    // "http://localhost:3000"
    // baseURL:"https://lms-api.annularprojects.com"
    baseURL:"https://lms-api.annularprojects.com:3001"

});

export default publicAPI;
