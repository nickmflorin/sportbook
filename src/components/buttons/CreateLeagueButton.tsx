"use client";
import { useDisclosure } from "@mantine/hooks";

import { CreateLeagueDrawer, type CreateLeagueDrawerProps } from "~/components/drawers/CreateLeagueDrawer";

import { Button, type ButtonProps } from "./Button";

export type CreateLeagueButtonProps = Pick<CreateLeagueDrawerProps, "action"> & Omit<ButtonProps, "onClick">;

export const CreateLeagueButton = ({
  action,
  children = "New League",
  ...props
}: CreateLeagueButtonProps): JSX.Element => {
  const [createLeagueDrawerOpen, { open: openLeagueDrawer, close: closeLeaguesDrawer }] = useDisclosure(false);
  return (
    <>
      <Button {...props} onClick={() => openLeagueDrawer()}>
        {children}
      </Button>
      <CreateLeagueDrawer
        open={createLeagueDrawerOpen}
        action={action}
        onClose={() => closeLeaguesDrawer()}
        onCancel={() => closeLeaguesDrawer()}
      />
    </>
  );
};
