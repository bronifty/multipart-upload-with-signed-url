const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.all("*", (req, res) => {
  res.status(404).send("yes hello this is dog");
});

// creating routes
app.get("/api", (req, res) => {
  res.send("Hello world!");
});

// to run and test locally
if (process.env.NODE_ENV === "development") {
  const PORT = 8080;

  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

module.exports.handler = serverless(app);
