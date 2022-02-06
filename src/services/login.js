import axios from "axios";
import { loginApi } from "../utils/url";

const login = async (credentials) => {
  const response = await axios.post(loginApi, credentials);
  return response.data;
};

export default { login };
