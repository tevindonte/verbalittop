import axios from "axios";

const notebookApi = axios.create({
  baseURL: "http://localhost:5000/api/notebook", // Replace with your backend's notebook endpoint
});

export default notebookApi;
