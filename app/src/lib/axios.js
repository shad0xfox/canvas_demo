import Axios from "axios";
import router from "../router";

const axios = Axios.create();

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response.data;
  },
  function (error) {
    if (error.response.status === 401) {
      router.push({ name: "Login" });
    }
    // Do something with response data
    return Promise.reject(error.response?.data.errors);
  }
);

export default axios;
