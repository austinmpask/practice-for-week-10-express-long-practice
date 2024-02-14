const express = require("express");
const app = express();
require("express-async-errors");

app.use(express.json());
app.use("/static", express.static("./assets"));

function logger(req, res, next) {
  console.log(req.method, req.path);
  res.on("finish", () => {
    console.log(res.statusCode);
  });
  next();
}

app.use(logger);

app.get("/", (req, res) => {
  res.json(
    "Express server running. No content provided at root level. Please use another route."
  );
});

// For testing express.json middleware
app.post("/test-json", (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors

app.get("/test-error", async (req, res) => {
  throw new Error("Hello World!");
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send("Shit broke!");
});

const port = 5000;
app.listen(port, () => console.log("Server is listening on port", port));
