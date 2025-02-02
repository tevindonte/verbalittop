import axios from "axios";

const notebookApi = axios.create({
  baseURL: "https://verbalitserver.onrender.com/api/notebook", // Replace with your backend's notebook endpoint
});

export default notebookApi;
