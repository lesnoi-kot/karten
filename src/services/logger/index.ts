import { settings } from "configs/settings";

import { Logger } from "./types";
import DevLogger from "./dev";
import NilLogger from "./nil";

let logger: Logger = NilLogger;

if (settings.logger === "dev") {
  logger = DevLogger;
} else if (settings.logger === "prod") {
  logger = DevLogger; // TODO: make production logger (logstash)
}

export default logger;
