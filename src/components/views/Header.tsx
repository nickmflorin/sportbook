import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { ModelImage, type ModelImageProps } from "~/components/images";
import { Title, type TitleProps, type TextProps, Description, descriptionIsVisible } from "~/components/typography";

import { Actions, type Action, filterVisibleActions } from "../structural/Actions";

export interface HeaderProps extends ComponentProps {
  readonly title?: string | JSX.Element;
  readonly imageProps?: ModelImageProps;
  readonly description?: Description;
  readonly actions?: Action[];
  readonly titleProps?: Omit<TitleProps, "children">;
  readonly descriptionProps?: Omit<TextProps, "children">;
}

const headerHasImage = (props: Pick<HeaderProps, "imageProps">): boolean =>
  [props.imageProps?.src !== undefined, props.imageProps?.fallbackInitials !== undefined].includes(true);

export const headerIsVisible = (
  props: Pick<HeaderProps, "title" | "description" | "imageProps" | "actions">,
): boolean =>
  [
    headerHasImage(props),
    props.title !== undefined && (typeof props.title !== "string" || props.title.trim() !== ""),
    descriptionIsVisible({ description: props.description }),
    props.actions && filterVisibleActions(props.actions).length !== 0,
  ].includes(true);

export const Header = ({
  title,
  description,
  actions = [],
  titleProps,
  descriptionProps,
  imageProps,
  ...props
}: HeaderProps): JSX.Element =>
  headerIsVisible({ title, description, actions, imageProps }) ? (
    <div
      {...props}
      className={classNames("header", { "header--with-image": headerHasImage({ imageProps }) }, props.className)}
    >
      {headerHasImage({ imageProps }) && <ModelImage {...imageProps} />}
      <div className="header__titles">
        {typeof title === "string" ? (
          <Title order={5} {...titleProps} className={classNames("header__title", titleProps?.className)}>
            {title}
          </Title>
        ) : (
          title
        )}
        <Description className="header__descriptions" description={description} {...descriptionProps} />
      </div>
      <Actions actions={actions} />
    </div>
  ) : (
    <></>
  );
