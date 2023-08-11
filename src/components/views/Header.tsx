import classNames from "classnames";
import { type Optional } from "utility-types";

import { isJSXElement } from "~/lib/core";
import { type ComponentProps } from "~/lib/ui";
import { type BadgeProps } from "~/components/badges/Badge";
import { type ImageProp } from "~/components/images";
import { ModelImage } from "~/components/images/ModelImage";
import { Description, descriptionIsVisible } from "~/components/typography/Description";
import { type TextProps } from "~/components/typography/Text";
import { Title, type TitleProps } from "~/components/typography/Title";

import { Actions, type Action, filterVisibleActions } from "../structural/Actions";

export interface HeaderProps extends ComponentProps {
  readonly title?: string | JSX.Element;
  readonly image?: Optional<ImageProp, "size"> | JSX.Element;
  readonly description?: Description;
  readonly actions?: Action[];
  readonly titleProps?: Omit<TitleProps, "children">;
  readonly tags?: React.ReactElement<BadgeProps>[];
  readonly descriptionProps?: Omit<TextProps, "children">;
}

const headerHasImage = (props: Pick<HeaderProps, "image">): boolean =>
  isJSXElement(props.image)
    ? true
    : [props.image?.url !== undefined, props.image?.initials !== undefined].includes(true);

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
  tags = [],
  ...props
}: HeaderProps): JSX.Element =>
  headerIsVisible({ title, description, actions, image }) ? (
    <div
      {...props}
      className={classNames("header", { "header--with-image": headerHasImage({ image }) }, props.className)}
    >
      {image !== undefined && headerHasImage({ image }) ? (
        isJSXElement(image) ? (
          image
        ) : (
          <ModelImage image={{ size: 80, ...image }} />
        )
      ) : (
        <></>
      )}
      <div className="header__content">
        {typeof title === "string" ? (
          <Title order={5} {...titleProps} className={classNames("header__title", titleProps?.className)}>
            {title}
          </Title>
        ) : (
          title
        )}
        {tags.length !== 0 && <div className="header__tags">{tags}</div>}
        <Description className="header__descriptions" description={description} {...descriptionProps} />
      </div>
      {/* <Actions actions={actions} /> */}
    </div>
  ) : (
    <></>
  );
