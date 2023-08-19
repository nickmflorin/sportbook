"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

import { SolidButton } from "~/components/buttons/SolidButton";
import { Loading } from "~/components/loading/Loading";

const Drawer = dynamic(() => import("~/components/drawers/Drawer"), {
  // ssr: false,
  loading: () => <Loading loading={true} />,
});

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
        viewProps={{ title: "Invite Players", description: "Invite players to your league." }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default InvitePlayersButton;
