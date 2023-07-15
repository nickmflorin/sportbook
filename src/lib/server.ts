export const isServer = () => typeof window === "undefined";

export const isClient = () => typeof window !== "undefined";

type ServerOnlyErrorParams = {
  readonly message?: string;
  readonly resource?: string;
};

export class ServerOnlyError extends Error {
  constructor(params?: ServerOnlyErrorParams) {
    const msg = params?.message
      ? params.message
      : params?.resource
      ? `Access to the resource '${params.resource}' is not permitted on the client!`
      : "Access to this resource is not permitted on the client!";
    super(msg);
    this.name = "ServerOnlyError";
  }
}

export const throwIfClient = (params?: ServerOnlyErrorParams) => {
  if (isClient()) {
    throw new ServerOnlyError(params);
  }
};
