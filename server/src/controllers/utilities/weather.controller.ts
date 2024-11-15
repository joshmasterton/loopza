import { Request, Response } from "express";
import { getWeatherForLocations } from "../../utilities/weather.utilities";

export const weather = async (_req: Request, res: Response) => {
  try {
    const currentWeather = await getWeatherForLocations();

    return res.status(200).json(currentWeather);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: "Weather server error" });
  }
};
