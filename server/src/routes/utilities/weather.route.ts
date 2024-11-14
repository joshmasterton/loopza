import express from "express";
import { weather } from "../../controllers/utilities/weather.controller";

export const weatherRoute = express.Router();

weatherRoute.get("/get", weather);
