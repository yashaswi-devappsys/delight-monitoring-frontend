import axios from "axios";
import { BASE_URL } from "../utils/env-helper";

const rsAxiosInstance = axios.create({
  baseURL: BASE_URL,
  /*
        NOTE : 
        timeout, common headers can be added here
    */
});

//TODO : change variable in your project
export default rsAxiosInstance;
