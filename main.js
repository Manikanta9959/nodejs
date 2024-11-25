import express from "express";
import routes from "./routes.js";
import cors from "cors";
import swagger from "./swagger.js";
import logger from "./logger.js";
import config from "./config.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);
swagger(app);  // API Swagger
routes(app);

app.listen(config.APP_PORT, () => {
  console.log(`Server is running on port ${config.APP_PORT}.`);
});

export default app;
