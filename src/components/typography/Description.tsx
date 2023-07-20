import React from "react";

import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { Text, type TextProps } from "~/components/typography";

type SingleDescription = string | JSX.Element | null | undefined;
export type Description = SingleDescription | SingleDescription[];

type BaseDescriptionProps = ComponentProps & Omit<TextProps, "children">;

export type DescriptionChildProps = BaseDescriptionProps & {
  readonly children: SingleDescription;
  readonly description?: never;
};

export type DescriptionExplicitProps = BaseDescriptionProps & {
  readonly description: Description;
  readonly children?: never;
};

export type DescriptionProps = DescriptionChildProps | DescriptionExplicitProps;

export const getFilteredDescriptions = (
  props: Pick<DescriptionProps, "children" | "description">,
): Exclude<SingleDescription, null | undefined>[] => {
  let description: SingleDescription[];
  if (props.description) {
    description = Array.isArray(props.description) ? props.description : [props.description];
  } else {
    description = [props.children];
  }
  return description.filter((d): d is Exclude<SingleDescription, null | undefined> => d !== null && d !== undefined);
};

export const descriptionIsVisible = (props: Pick<DescriptionProps, "children" | "description">) =>
  getFilteredDescriptions(props).length !== 0;

export const Description = ({ className, style, description, children, ...props }: DescriptionProps): JSX.Element => {
  const filtered = getFilteredDescriptions({ description, children });
  if (filtered.length === 0) {
    return <></>;
  }
  return (
    <div style={style} className={classNames("descriptions", className)}>
      {filtered.map((d: Exclude<SingleDescription, null | undefined>, i) =>
        typeof d === "string" ? (
          <Text size="sm" color="gray.6" {...props} key={i} className="description">
            {d}
          </Text>
        ) : (
          <React.Fragment key={i}>{d}</React.Fragment>
        ),
      )}
    </div>
  );
};
