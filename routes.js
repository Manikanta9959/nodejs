import CsvToJson from "./api/controllers/csvtojson/router.js";

export default function routes(app) {
  app.use("/api/v1/", CsvToJson);
}
