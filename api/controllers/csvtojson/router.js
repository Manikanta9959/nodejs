import * as express from "express";
import { uploadCSV, ageDistribution } from "./controller.js";

export default express.Router().post('/upload', uploadCSV).get('/age-distribution', ageDistribution);