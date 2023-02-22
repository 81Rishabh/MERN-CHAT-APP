import axios from "axios";
import { URL } from "../../../../helper/url";

const getUsers = async () => {
  const response = await axios(URL.get_users);
  return response.data;
};

const userServices = {
  getUsers,
};

export default userServices;
