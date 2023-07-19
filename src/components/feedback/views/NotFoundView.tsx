import { type Optional } from "utility-types";

import { BaseFeedbackView, type BaseFeedbackViewProps } from "./BaseFeedbackView";

export type NotFoundViewProps = Optional<BaseFeedbackViewProps, "title">;

export const NotFoundView = ({
  title = "Not Found",
  description = "The requested resource could not be found.",
  ...props
}: NotFoundViewProps): JSX.Element => <BaseFeedbackView {...props} description={description} title={title} />;
