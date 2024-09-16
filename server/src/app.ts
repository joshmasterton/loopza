import express from "express";

const app = express();

app.get("/", (_req, res) => res.send({ message: "Loopza" }));

app.listen(80, () => {
  console.log("Listening to server on port 80");
});
