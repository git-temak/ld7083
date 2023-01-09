import axios from "axios";

export const baseURL = "https://api.coronavirus.data.gov.uk/v1/data";

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
