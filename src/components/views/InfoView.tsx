import { type ReactNode } from "react";

import classNames from "classnames";
import { type Optional } from "utility-types";

import { isJSXElement } from "~/lib/core";
import { type ComponentProps } from "~/lib/ui";
import { type BadgeProps } from "~/components/badges/Badge";
import { type ImageProp } from "~/components/images";
import { ModelImage } from "~/components/images/ModelImage";
import { type Description as Desc } from "~/components/typography";
import { Description, descriptionIsVisible } from "~/components/typography/Description";
import { type TextProps } from "~/components/typography/Text";
import { Title, type TitleProps } from "~/components/typography/Title";

import { Actions, type Action, filterVisibleActions } from "../structural/Actions";

export interface InfoViewProps extends ComponentProps {
  readonly title?: string | JSX.Element;
  readonly subTitle?: ReactNode;
  readonly image?: Optional<ImageProp, "size"> | JSX.Element;
  readonly description?: Desc;
  readonly rightContent?: ReactNode;
  readonly actions?: Action[];
  readonly horizontalSpacing?: number;
  readonly contentVerticalOffset?: number;
  readonly titleProps?: Omit<TitleProps, "children">;
  readonly tags?: React.ReactElement<BadgeProps>[];
  readonly descriptionProps?: Omit<TextProps, "children">;
}

type _InfoViewProps = InfoViewProps & {
  readonly children?: ReactNode;
};

const infoViewHasImage = (props: Pick<InfoViewProps, "image">): boolean =>
  isJSXElement(props.image)
    ? true
    : [props.image?.url !== undefined, props.image?.initials !== undefined].includes(true);

export const infoViewIsVisible = (
  props: Pick<_InfoViewProps, "title" | "description" | "image" | "actions" | "children">,
): boolean =>
  [
    infoViewHasImage(props),
    props.title !== undefined && (typeof props.title !== "string" || props.title.trim() !== ""),
    descriptionIsVisible({ description: props.description }),
    props.actions && filterVisibleActions(props.actions).length !== 0,
    props.children !== undefined && props.children !== null && props.children !== false && props.children !== "",
  ].includes(true);

export const InfoView = ({
  title,
  description,
  actions = [],
  titleProps,
  descriptionProps,
  image,
  horizontalSpacing = 12,
  subTitle,
  tags = [],
  rightContent,
  children,
  contentVerticalOffset,
  ...props
}: _InfoViewProps): JSX.Element =>
  infoViewIsVisible({ title, description, actions, image, children }) ? (
    <div
      {...props}
      className={classNames("info-view", { "info-view--with-image": infoViewHasImage({ image }) }, props.className)}
    >
      {image !== undefined && infoViewHasImage({ image }) ? (
        isJSXElement(image) ? (
          <div style={{ marginRight: horizontalSpacing }}>{image}</div>
        ) : (
          <ModelImage image={{ size: 80, ...image }} style={{ marginRight: horizontalSpacing }} />
        )
      ) : (
        <></>
      )}
      <div className="info-view__content">
        <div
          className="info-view__content-left"
          style={
            infoViewHasImage({ image }) || contentVerticalOffset !== undefined
              ? { paddingTop: contentVerticalOffset === undefined ? 4 : contentVerticalOffset }
              : {}
          }
        >
          {typeof title === "string" ? (
            <Title order={5} {...titleProps} className={classNames("info-view__title", titleProps?.className)}>
              {title}
            </Title>
          ) : (
            title
          )}
          {subTitle}
          {tags.length !== 0 && <div className="info-view__tags">{tags}</div>}
          <Description className="info-view__descriptions" description={description} {...descriptionProps} />
        </div>
        <div className="info-view__content-right">{rightContent}</div>
      </div>
      <Actions actions={actions} />
    </div>
  ) : (
    <></>
  );

export default InfoView;
