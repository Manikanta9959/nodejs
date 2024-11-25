import { createLogger, transports, format } from "winston";
const { combine, timestamp, printf } = format;
import path from "path";
import config from "./config.js";

const logLevels = {
  error: 0,
  info: 1,
  debug: 2,
  trace: 3,
};

const customFormat = printf(
  ({ level, message, timestamp, service, API_INSTANCE, User, func }) => {
    return `${timestamp}| ${level} | ${service} | ${API_INSTANCE} | ${User} | ${func} | ${message}`;
  }
);

const logger = createLogger({
  levels: logLevels,
  defaultMeta: {
    service: "CSV_JSON",
    API_INSTANCE: "v1",
  },
  transports: [
    new transports.File({
      filename: path.join(config.LOG_DIR, "error.log"),
      level: "error",
      format: combine(
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        customFormat
      ),
    }),
    new transports.File({
      filename: path.join(config.LOG_DIR, "info.log"),
      level: "info",
      format: format.combine(
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        customFormat
      ),
    }),
    new transports.File({
      filename: path.join(config.LOG_DIR, "debug.log"),
      level: "debug",
      format: format.combine(
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss:SSS",
        }),
        customFormat
      ),
    }),
    new transports.File({
      filename: path.join(config.LOG_DIR, "trace.log"),
      level: "trace",
      format: format.combine(
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        customFormat
      ),
    }),
  ],
});

export default logger;
