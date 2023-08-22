"use client";
import { useState } from "react";

import { SolidButton } from "~/components/buttons/SolidButton";
import { Drawer } from "~/components/drawers/Drawer";
import { InfoView } from "~/components/views/InfoView";

export interface InvitePlayersButtonProps {
  readonly drawer: JSX.Element;
}

export const InvitePlayersButton = ({ drawer }: InvitePlayersButtonProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SolidButton.Primary onClick={() => setOpen(true)}>Invite Players</SolidButton.Primary>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        viewProps={{ header: <InfoView title="Invite Players" description="Invite players to your league." /> }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default InvitePlayersButton;
