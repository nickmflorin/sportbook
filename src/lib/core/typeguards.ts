import React from "react";

/**
 * A typeguard that can be used to test whether or not a value is a {@link React.ReactElement} (which is just a more
 * specifically typed {@link JSX.Element}).
 */
export const isJSXElement = (value: unknown): value is JSX.Element => React.isValidElement(value);
