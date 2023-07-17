import classNames from "classnames";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

import { logger } from "~/internal/logger";
import { type ComponentProps } from "~/lib/ui";
import { SolidButton } from "~/components/buttons";

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
  readonly onSubmit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  readonly onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
  /* This hook will indicate a pending status when the component is inside of a Form and the Form's action is
     submitting.  As such, in cases where we are using the form's action prop and this component is inside of that form,
     we do not need to explicitly provide the 'submitting' prop to this component. */
  const { pending } = useFormStatus();

  const visibility = buttonVisibility({ submitButtonType, ...props });
  if (!(visibility.submit || visibility.cancel)) {
    logger.error("The button footer is not configured to show a submit or cancel button.");
    return <></>;
  }

  const submitting = [props.submitting, pending].includes(true);

  return (
    <div style={style} className={classNames("button-footer", `button-footer--${orientation}`, className)}>
      <ShowHide show={visibility.cancel}>
        <SolidButton.Secondary
          className="button-footer__button"
          onClick={e => props.onCancel?.(e)}
          locked={submitting}
          disabled={props.disabled || props.cancelDisabled}
        >
          {cancelText}
        </SolidButton.Secondary>
      </ShowHide>
      <ShowHide show={visibility.submit}>
        <SolidButton.Primary
          className="button-footer__button"
          type={submitButtonType}
          loading={submitting}
          onClick={e => props.onSubmit?.(e)}
          disabled={props.disabled || props.submitDisabled}
        >
          {submitText}
        </SolidButton.Primary>
      </ShowHide>
    </div>
  );
};
