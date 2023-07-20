"use client";
import { Text, type TextProps, packSx } from "@mantine/core";
import { type PolymorphicComponentProps } from "@mantine/utils";

import { type BaseUser, parseUserDisplayName } from "~/prisma/model/user";

export type UserFullNameTextProps<U extends BaseUser> = Omit<
  PolymorphicComponentProps<"div", TextProps>,
  "children"
> & {
  readonly user: U;
};

export const UserFullNameText = <U extends BaseUser>({ user, ...props }: UserFullNameTextProps<U>): JSX.Element => {
  const name = parseUserDisplayName(user);
  if (!name) {
    return <></>;
  }
  return (
    <Text<"div">
      size="sm"
      color="gray.7"
      maw="100%"
      {...props}
      sx={[
        t => ({
          fontWeight: t.other.fontWeights.medium,
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }),
        ...packSx(props.sx),
      ]}
      component="div"
    >
      {name}
    </Text>
  );
};
