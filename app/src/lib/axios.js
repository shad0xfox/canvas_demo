import Axios from "axios";

const axios = Axios.create();

axios.defaults.baseURL = "http://localhost:3000/api";
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Do something with response data
    return Promise.reject(error.response.data.errors);
  }
);

export default axios;
