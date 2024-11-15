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

const locations = [
  { name: "New York", country: "USA", query: "New York" },
  { name: "London", country: "UK", query: "London" },
  { name: "Tokyo", country: "Japan", query: "Tokyo" },
];

export const getWeatherForLocations = async () => {
  try {
    const { WEATHER_API_KEY } = process.env;

    const weatherData = await Promise.all(
      locations.map(async (location) => {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location.query}&appid=${WEATHER_API_KEY}&units=metric`
        );
        return response.data;
      })
    );
    return weatherData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
