import { get, post, postFile} from "./axios";

const uploadData = async (file, email) => {
  return postFile("/upload", file, email);
};

const runModel = async (data) => {
  return post("/run", { data: data });
};

const getJobs = async (email) => {
  return get("/get_jobs", { email: email});
}

const addJobs = async (data) => {
  return post("/add_job", { data: data });
}

const apis = {
  uploadData,
  runModel,
  getJobs,
  addJobs,
};

export default apis;