import { logger } from "~/application/logger";
import { createHotReloadIsolatedFn } from "~/application/util";

import { configure as configureFontAwesome } from "./fontAwesome/configure";

export const configureServerApplication = createHotReloadIsolatedFn("serverApplicationConfigured", () => {
  logger.info("Configuring server application.");
  configureFontAwesome();
});
