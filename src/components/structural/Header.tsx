import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { Title, Text, type TitleProps, type TextProps } from "~/components/typography";

import { Actions, type Action, filterVisibleActions } from "./Actions";

export interface HeaderProps extends ComponentProps {
  readonly title?: string | JSX.Element;
  readonly description?: string;
  readonly actions?: Action[];
  readonly titleProps?: Omit<TitleProps, "children">;
  readonly descriptionProps?: Omit<TextProps, "children">;
}

export const Header = ({
  title,
  description,
  actions = [],
  titleProps,
  descriptionProps,
  ...props
}: HeaderProps): JSX.Element => {
  if (!description && !title && filterVisibleActions(actions).length === 0) {
    return <></>;
  }
  return (
    <div {...props} className={classNames("header", props.className)}>
      {(description || title) && (
        <div className="header__titles">
          {typeof title === "string" ? (
            <Title order={5} {...titleProps} className={classNames("header__title", titleProps?.className)}>
              {title}
            </Title>
          ) : (
            title
          )}
          {description && (
            <Text
              size="sm"
              {...descriptionProps}
              className={classNames("header__subtitle", descriptionProps?.className)}
            >
              {description}
            </Text>
          )}
        </div>
      )}
      <Actions actions={actions} />
    </div>
  );
};
