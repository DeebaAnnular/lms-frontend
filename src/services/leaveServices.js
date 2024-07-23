import publicAPI from "./publicApi";
import Routeconfig from "./RouteConfig";


export const getLeaveBalance = async (id) => {
  try {
    const response = await publicAPI.get(`${Routeconfig.getLeaveBalance}${id}`);
    const data = await response.data;
    return data;
  } catch (error) {
    console.log("Error at get leave balance", error);
    throw Error(error.response.data);
  }
};

