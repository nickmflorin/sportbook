import { logger } from "~/internal/logger";

import { configure as configureFontAwesome, configureAsync as configureFontAwesomeAsync } from "./fontAwesome";

export const configureClientApplication = () => {
  logger.info("Configuring client application synchronously.");
  configureFontAwesome();
};

export const configureClientApplicationAsync = async () => {
  logger.info("Configuring client application asynchronously.");
  await configureFontAwesomeAsync();
};
