"use client";
import { Flex, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CreateLeagueDrawer } from "~/components/drawers/CreateLeagueDrawer";

export const LeaguesHeader = (): JSX.Element => {
  const [createLeagueDrawerOpen, { open: openLeagueDrawer }] = useDisclosure(false);

  return (
    <>
      <Flex direction="row" justify="right">
        <Button onClick={() => openLeagueDrawer()}>New League</Button>
      </Flex>
      <CreateLeagueDrawer open={createLeagueDrawerOpen} />
    </>
  );
};
