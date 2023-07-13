import classNames from "classnames";

import { logger } from "~/internal/logger";
import { type ComponentProps } from "~/lib/ui";
import { PrimaryButton } from "~/components/buttons";

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
  style,
  className,
  ...props
}: ButtonFooterProps) => {
  const visibility = buttonVisibility({ submitButtonType, ...props });
  if (!(visibility.submit || visibility.cancel)) {
    logger.error("The button footer is not configured to show a submit or cancel button.");
    return <></>;
  }
  return (
    <div style={style} className={classNames("button-footer", `button-footer--${orientation}`, className)}>
      <ShowHide show={visibility.cancel}>
        <PrimaryButton
          className="button-footer__button"
          onClick={props.onCancel}
          disabled={props.disabled || props.submitting || props.cancelDisabled}
        >
          {cancelText}
        </PrimaryButton>
      </ShowHide>
      <ShowHide show={visibility.submit}>
        <PrimaryButton
          className="button-footer__button"
          type={submitButtonType}
          onClick={props.onSubmit}
          disabled={props.disabled || props.submitting || props.submitDisabled}
        >
          {submitText}
        </PrimaryButton>
      </ShowHide>
    </div>
  );
};
