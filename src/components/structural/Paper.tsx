"use client";
import { Flex, Paper as RootPaper, type PaperProps as RootPaperProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

import { ActionIconColor } from "~/components/buttons/ActionIcon";

import { Collapse } from "./Collapse";
import { Header, type ExposedHeaderProps } from "./Header";

export interface PaperProps extends ExposedHeaderProps, RootPaperProps {
  readonly collapsable?: boolean;
  readonly defaultVisible?: boolean;
}

export const Paper = ({
  children,
  defaultVisible = false,
  collapsable = false,
  actions = [],
  subTitle,
  title,
  ...props
}: PaperProps): JSX.Element => {
  const [contentOpened, { toggle: _toggleContent }] = useDisclosure(defaultVisible);
  return (
    <RootPaper
      p="md"
      {...props}
      sx={[
        t => ({
          borderRadius: t.radius.xs,
          border: `1px solid ${t.colors.gray[4]}`,
        }),
      ]}
    >
      <Header
        mb={contentOpened || collapsable === false ? "md" : 0}
        title={title}
        subTitle={subTitle}
        actions={[
          ...(actions || []),
          collapsable
            ? {
                onClick: () => _toggleContent(),
                color: ActionIconColor.GRAY,
                icon: contentOpened ? IconChevronDown : IconChevronUp,
              }
            : undefined,
        ]}
      />
      <Collapse opened={collapsable === true ? contentOpened : undefined}>
        <Flex direction="column">{children}</Flex>
      </Collapse>
    </RootPaper>
  );
};
