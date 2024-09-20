import axios from "axios";

const http = "http://localhost:80";

export const login = async <T>(body: T) => {
  try {
    const response = await axios.post(http + "/login", body);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export const signup = async <T>(body: T) => {
  try {
    const response = await axios.post(http + "/signup", body);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
