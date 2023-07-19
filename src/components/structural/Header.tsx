import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { ModelImage, type ModelImageProps } from "~/components/images";
import { Title, type TitleProps, type TextProps, Description } from "~/components/typography";

import { Actions, type Action } from "./Actions";

export interface HeaderProps extends ComponentProps, Pick<ModelImageProps, "fallbackInitials"> {
  readonly title?: string | JSX.Element;
  readonly imageSrc?: ModelImageProps["src"];
  readonly imageSize?: ModelImageProps["size"];
  readonly description?: Description;
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
  imageSrc,
  fallbackInitials,
  imageSize = 120,
  ...props
}: HeaderProps): JSX.Element => (
  <div
    {...props}
    className={classNames("header", { "header--with-image": imageSrc || fallbackInitials }, props.className)}
  >
    {(imageSrc || fallbackInitials) && (
      <ModelImage src={imageSrc} fallbackInitials={fallbackInitials} size={imageSize} />
    )}
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
);
