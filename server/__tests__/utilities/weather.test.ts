import { describe, expect, test } from "vitest";
import { getUserCity, getWeather } from "../../src/utilities/weather.utilities";

describe("weather", () => {
  test("Should return the users location based off ip", async () => {
    // const city = await getUserCity();
    // expect(city).toBeDefined();
  });

  test("Should return the weather based off users city", async () => {
    // const weather = await getWeather();
    // expect(weather.weather).toBeDefined();
  });
});
