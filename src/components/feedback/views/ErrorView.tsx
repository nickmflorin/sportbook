import { type Optional } from "utility-types";

import { BaseFeedbackView, type BaseFeedbackViewProps } from "./BaseFeedbackView";

export type ErrorViewProps = Optional<BaseFeedbackViewProps, "title">;

export const ErrorView = ({
  title = "Error",
  description = "There was an error.",
  ...props
}: ErrorViewProps): JSX.Element => <BaseFeedbackView {...props} title={title} description={description} />;
