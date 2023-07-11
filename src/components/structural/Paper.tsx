"use client";
import { Flex, Paper as RootPaper, type PaperProps as RootPaperProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

import { ActionIconColor } from "~/components/buttons/ActionIcon";

import { Collapse } from "./Collapse";
import { Header, type HeaderProps } from "./Header";

export interface PaperProps extends Omit<HeaderProps, "className" | "style">, RootPaperProps {
  readonly collapsable?: boolean;
  readonly defaultVisible?: boolean;
}

export const Paper = ({
  children,
  defaultVisible = false,
  collapsable = false,
  actions = [],
  description,
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
        style={contentOpened || collapsable === false ? { marginBottom: 8 } : {}}
        title={title}
        description={description}
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
