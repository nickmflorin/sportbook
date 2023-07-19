import { type Optional } from "utility-types";

import { ApplicationError, type ApplicationErrorConfig } from "./ApplicationError";
import { ApplicationErrorCodes } from "./codes";

export class NotAuthenticatedError extends ApplicationError<typeof ApplicationErrorCodes.NOT_AUTHENTICATED> {
  constructor(
    config?: Omit<Optional<ApplicationErrorConfig<typeof ApplicationErrorCodes.NOT_AUTHENTICATED>, "message">, "code">,
  ) {
    super({
      message: "The user is not authenticated.",
      ...config,
      code: ApplicationErrorCodes.NOT_AUTHENTICATED,
    });
  }
}
