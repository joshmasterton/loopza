import express from "express";

export const login = express.Router();

login.post("/", (req, res) => {
  console.log(req.body);
  return res.json(req.body);
});
