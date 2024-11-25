import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerJson from "./swagdoc.js";

const options = {
  definition: swaggerJson,
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

const swagger = (app) => {
  app.use("/docs/doc", swaggerUi.serve, swaggerUi.setup(specs));
};

export default swagger;
