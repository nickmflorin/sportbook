"use client";
import { useState } from "react";

import { SolidButton } from "~/components/buttons/SolidButton";
import { Drawer } from "~/components/drawers/Drawer";
import { InvitePlayersDrawer } from "~/components/drawers/InvitePlayersDrawer";
import { InfoView } from "~/components/views/InfoView";

export interface InvitePlayersButtonProps {
  readonly leagueId: string;
}

export const InvitePlayersButton = ({ leagueId }: InvitePlayersButtonProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SolidButton.Primary onClick={() => setOpen(true)}>Invite Players</SolidButton.Primary>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        viewProps={{ header: <InfoView title="Invite Players" description="Invite players to your league." /> }}
      >
        <InvitePlayersDrawer leagueId={leagueId} />
      </Drawer>
    </>
  );
};

export default InvitePlayersButton;
