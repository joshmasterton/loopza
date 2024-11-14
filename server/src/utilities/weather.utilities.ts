import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(
    __dirname,
    "..",
    "..",
    `${process.env.NODE_ENV === "development" ? ".env.dev" : ".env.test"}`
  ),
});

export const getUserCity = async () => {
  try {
    const { IP_INFO_API_KEY } = process.env;
    const response = await axios.get(
      `https://ipinfo.io/json?token=${IP_INFO_API_KEY}`
    );
    return response.data.city;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};

export const getWeather = async () => {
  try {
    const { WEATHER_API_KEY } = process.env;
    const city = await getUserCity();
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
