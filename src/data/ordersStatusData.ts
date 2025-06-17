import { GridRowsProp } from "@mui/x-data-grid";
import { getOrderStatus } from "services/dashboardService";


export let ordersStatusData: GridRowsProp = [];

export const fetchOrdersStatusData = async () => {
  ordersStatusData = await getOrderStatus();
  console.log("Fetched Orders Status Data:", ordersStatusData);
  
};
