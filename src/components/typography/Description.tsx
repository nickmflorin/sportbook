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

export const Description = ({
  className,
  style,
  description: _description,
  children,
  ...props
}: DescriptionProps): JSX.Element => {
  let description: SingleDescription[];
  if (_description) {
    description = Array.isArray(_description) ? _description : [_description];
  } else {
    description = [children];
  }
  const filtered = description.filter(
    (d): d is Exclude<SingleDescription, null | undefined> => d !== null && d !== undefined,
  );
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
