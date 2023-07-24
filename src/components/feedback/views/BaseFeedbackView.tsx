"use client";
import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { AlternateButton, type AlternateButtonProps } from "~/components/buttons/AlternateButton";
import { Title, Text } from "~/components/typography";

type LinkObj = {
  readonly label: string;
  readonly href: Exclude<AlternateButtonProps<"primary">["href"], undefined>;
};

type Link = JSX.Element | LinkObj;

export interface BaseFeedbackViewProps extends ComponentProps {
  readonly title: string;
  readonly description?: string;
  readonly link?: Link;
}

const linkIsNotJSX = (link: Link): link is LinkObj =>
  typeof link === "object" &&
  link !== null &&
  "label" in link &&
  link.label !== undefined &&
  "href" in link &&
  link.href !== undefined;

export const BaseFeedbackView = ({ title, description, link, ...props }: BaseFeedbackViewProps): JSX.Element => (
  <div {...props} className={classNames("feedback-view", props.className)}>
    <div className="feedback-view__content">
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
