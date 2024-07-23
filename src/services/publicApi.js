import axios from "axios";

const publicAPI = axios.create({
    baseURL:"http://localhost:3000"
});

export default publicAPI;