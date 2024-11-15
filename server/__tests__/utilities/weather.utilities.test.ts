import { describe, test } from "vitest";
import request from "supertest";
import { app } from "../../src/app";

describe("weather", () => {
  test("Should return the users weather based off ip", async () => {
    const response = await request(app).get("/weather/get");
    console.log(response.body);
  });
});
