import classNames from "classnames";
import { type Optional } from "utility-types";

import { type ComponentProps, type ImageProp } from "~/lib/ui";
import { ModelImage } from "~/components/images";
import { Title, type TitleProps, type TextProps, Description, descriptionIsVisible } from "~/components/typography";

import { Actions, type Action, filterVisibleActions } from "../structural/Actions";

export interface HeaderProps extends ComponentProps {
  readonly title?: string | JSX.Element;
  readonly image?: Optional<ImageProp, "size">;
  readonly description?: Description;
  readonly actions?: Action[];
  readonly titleProps?: Omit<TitleProps, "children">;
  readonly descriptionProps?: Omit<TextProps, "children">;
}

const headerHasImage = (props: Pick<HeaderProps, "image">): boolean =>
  [props.image?.url !== undefined, props.image?.initials !== undefined].includes(true);

export const headerIsVisible = (props: Pick<HeaderProps, "title" | "description" | "image" | "actions">): boolean =>
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
  image,
  ...props
}: HeaderProps): JSX.Element =>
  headerIsVisible({ title, description, actions, image }) ? (
    <div
      {...props}
      className={classNames("header", { "header--with-image": headerHasImage({ image }) }, props.className)}
    >
      {image !== undefined && headerHasImage({ image }) && <ModelImage image={{ size: 80, ...image }} />}
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
