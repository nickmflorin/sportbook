import classNames from "classnames";
import { type Optional } from "utility-types";

import { ActionButton } from "./ActionButton";
import { AlternateButton, type AlternateButtonProps } from "./AlternateButton";

export type BackButtonProps = Optional<Omit<AlternateButtonProps<"bare">, "icon" | "variant">, "children">;

export const BackButton = ({ children, ...props }: BackButtonProps): JSX.Element => {
  if (children) {
    return (
      <AlternateButton.Bare
        color="gray.7"
        hoveredColor="gray.8"
        fontSize="sm"
        fontWeight="regular"
        {...props}
        className={classNames("back-button", "back-alternate-button", props.className)}
        icon={{ name: "arrow-left" }}
      >
        {children}
      </AlternateButton.Bare>
    );
  }
  return (
    <ActionButton.Bare
      color="gray.7"
      hoveredColor="gray.8"
      {...props}
      className={classNames("back-button", "back-action-button", props.className)}
      icon={{ name: "arrow-left" }}
    />
  );
};
