import { get, post, postFile} from "./axios";

const uploadData = async (file, email) => {
  return postFile("/upload", file, email);
};

const runModel = async (data) => {
  return post("/run", { data: data });
};

const getJobs = async () => {
  return get("/get_jobs");
}

const addJobs = async (data) => {
  return post("/add_job", { name: data });
}

const apis = {
  uploadData,
  runModel,
  getJobs,
  addJobs,
};

export default apis;