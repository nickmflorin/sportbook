import { type ApplicationErrorCode } from "./codes";

export interface IApplicationError<C extends ApplicationErrorCode = ApplicationErrorCode> {
  readonly message: string;
  readonly name: string;
  readonly code: C;
}

export interface ApplicationErrorConfig<C extends ApplicationErrorCode> {
  readonly code: C;
  readonly message: string;
}

export class ApplicationError<C extends ApplicationErrorCode = ApplicationErrorCode>
  extends Error
  implements IApplicationError<C>
{
  public readonly message: string;
  public readonly name: string;
  public readonly code: C;

  constructor(config: ApplicationErrorConfig<C>) {
    super();
    this.message = config.message;
    this.code = config.code;
    this.name = this.constructor.name;
  }
}
