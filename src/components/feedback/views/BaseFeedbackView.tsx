"use client";
import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { AlternateButton, type AlternateButtonProps } from "~/components/buttons/AlternateButton";
import { Text } from "~/components/typography/Text";
import { Title } from "~/components/typography/Title";

import css from "./FeedbackView.module.scss";

type LinkObj = {
  readonly label: string;
  readonly href: Exclude<AlternateButtonProps<"primary">["href"], undefined>;
};

type Link = JSX.Element | LinkObj;

export interface BaseFeedbackViewProps extends ComponentProps {
  readonly title: string;
  readonly description?: string;
  readonly link?: Link;
  readonly coverScreen?: boolean;
}

const linkIsNotJSX = (link: Link): link is LinkObj =>
  typeof link === "object" &&
  link !== null &&
  "label" in link &&
  link.label !== undefined &&
  "href" in link &&
  link.href !== undefined;

export const BaseFeedbackView = ({
  coverScreen,
  title,
  description,
  link,
  ...props
}: BaseFeedbackViewProps): JSX.Element => (
  <div
    {...props}
    className={classNames(css["feedback-view"], coverScreen && css["feedback-view--cover-screen"], props.className)}
  >
    <div className={css["feedback-view__content"]}>
      <Title order={3}>{title}</Title>
      {description && <Text>{description}</Text>}
      {link && linkIsNotJSX(link) ? (
        <AlternateButton.Primary href={link.href}>{link.label}</AlternateButton.Primary>
      ) : (
        <>{link}</>
      )}
    </div>
  </div>
);
