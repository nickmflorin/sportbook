import { type Optional } from "utility-types";

import { ApplicationError, type ApplicationErrorConfig } from "./ApplicationError";
import { ApplicationErrorCodes } from "./codes";

export class ForbiddenError extends ApplicationError<typeof ApplicationErrorCodes.FORBIDDEN> {
  public readonly redirectUrl?: string;

  constructor(
    config?: Omit<Optional<ApplicationErrorConfig<typeof ApplicationErrorCodes.FORBIDDEN>, "message">, "code"> & {
      readonly redirectUrl?: string;
    },
  ) {
    super({
      message: "The user does not have the appropriate permissions to perform this action.",
      ...config,
      code: ApplicationErrorCodes.FORBIDDEN,
    });
    this.redirectUrl = config?.redirectUrl;
  }
}
