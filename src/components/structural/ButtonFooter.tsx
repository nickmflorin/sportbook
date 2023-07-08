import { Button } from "@mantine/core";

import { mergeComponentProps } from "~/lib/ui";
import { logger } from "~/internal/logger";
import { ShowHide } from "../util";

type ButtonFooterOrientation = "right-justified" | "full-width";

export type ButtonFooterProps = ComponentProps & {
  readonly orientation?: ButtonFooterOrientation;
  readonly submitText?: string;
  readonly cancelText?: string;
  readonly submitButtonType?: "submit" | "button";
  readonly submitting?: boolean;
  readonly disabled?: boolean;
  readonly submitDisabled?: boolean;
  readonly cancelDisabled?: boolean;
  readonly onSubmit?: () => void;
  readonly onCancel?: () => void;
};

const buttonVisibility = (
  props: Pick<ButtonFooterProps, "submitButtonType" | "onSubmit" | "onCancel">,
): { submit: boolean; cancel: boolean } => {
  if (props.onSubmit && props.submitButtonType === "submit") {
    throw new Error("The 'onSubmit' handler should not be provided when the 'submitButtonType' is 'submit'.");
  }
  return {
    // The submit button should be shown if the submit handler is provided or if the submit button type is "submit".
    submit: props.onSubmit !== undefined || props.submitButtonType === "submit",
    cancel: props.onCancel !== undefined,
  };
};

export const ButtonFooter = ({
  cancelText = "Cancel",
  submitText = "Save",
  submitButtonType = "submit",
  orientation = "right-justified",
  ...props
}: ButtonFooterProps) => {
  const visibility = buttonVisibility({ submitButtonType, ...props });
  if (!(visibility.submit || visibility.cancel)) {
    logger.error("The button footer is not configured to show a submit or cancel button.");
    return <></>;
  }
  return (
    <div {...mergeComponentProps(props, { className: ["button-footer", `button-footer--${orientation}`] })}>
      <ShowHide show={visibility.cancel}>
        <Button
          className="button-footer__button"
          variant="default"
          onClick={props.onCancel}
          disabled={props.disabled || props.submitting || props.cancelDisabled}
        >
          {cancelText}
        </Button>
      </ShowHide>
      <ShowHide show={visibility.submit}>
        <Button
          className="button-footer__button"
          type={submitButtonType}
          variant="default"
          onClick={props.onSubmit}
          disabled={props.disabled || props.submitting || props.submitDisabled}
        >
          {submitText}
        </Button>
      </ShowHide>
    </div>
  );
};
