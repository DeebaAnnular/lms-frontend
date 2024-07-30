import axios from "axios";

const publicAPI = axios.create({
    baseURL:"http://13.201.79.49:9091/"
});

export default publicAPI;