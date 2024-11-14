import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../utilities/request.utilities";
import { WeatherResponse } from "../../types/features/features.types";
import { LoadingSpinner } from "./Loading.component";

export const Weather = () => {
  const [loading, setLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState<
    WeatherResponse | undefined
  >(undefined);

  const getWeather = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/weather/get`);
      setCurrentWeather(response.data.currentWeather);
      return response.data.currentWeather as WeatherResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <div className="weather">
      <main>
        {loading ? (
          <LoadingSpinner />
        ) : (
          currentWeather && (
            <>
              <div>{currentWeather?.sys.country} </div>
              <p>{currentWeather?.weather[0].main}</p>
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather?.weather[0].icon}@2x.png`}
              />
              <h2>{Math.floor(currentWeather?.main.temp ?? 0)}°C</h2>
            </>
          )
        )}
      </main>
    </div>
  );
};
