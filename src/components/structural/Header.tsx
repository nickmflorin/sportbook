import { Title, Text } from "~/components/typography";
import { type ComponentProps, pluckNativeComponentProps } from "~/lib/ui";

import { Actions, type Action, filterVisibleActions } from "./Actions";

export type ExposedHeaderProps = {
  readonly title?: string | JSX.Element;
  readonly subTitle?: string;
  readonly actions?: Action[];
};

export interface HeaderProps extends Pick<ComponentProps, "className" | "style">, ExposedHeaderProps {}

export const Header = (props: HeaderProps): JSX.Element => {
  const [{ title, subTitle, actions = [] }, nativeProps] = pluckNativeComponentProps({ className: "header" }, props);
  if (subTitle || title || filterVisibleActions(actions).length !== 0) {
    return (
      <div {...nativeProps}>
        {(subTitle || title) && (
          <div className="header__titles">
            {typeof title === "string" ? (
              <Title className="header__title" order={5}>
                {title}
              </Title>
            ) : (
              title
            )}
            {subTitle && (
              <Text fontSize="sm" className="header__subtitle">
                {subTitle}
              </Text>
            )}
          </div>
        )}
        <Actions actions={actions} />
      </div>
    );
  }
  return <></>;
};
