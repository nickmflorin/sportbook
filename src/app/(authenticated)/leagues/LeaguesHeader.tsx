"use client";
import { Flex, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { CreateLeagueDrawer, type CreateLeagueDrawerProps } from "~/components/drawers/CreateLeagueDrawer";

export type LeaguesHeaderProps = Pick<CreateLeagueDrawerProps, "action">;

export const LeaguesHeader = ({ action }: LeaguesHeaderProps): JSX.Element => {
  const [createLeagueDrawerOpen, { open: openLeagueDrawer }] = useDisclosure(false);
  return (
    <>
      <Flex direction="row" justify="right">
        <Button onClick={() => openLeagueDrawer()}>New League</Button>
      </Flex>
      <CreateLeagueDrawer open={createLeagueDrawerOpen} action={action} />
    </>
  );
};
