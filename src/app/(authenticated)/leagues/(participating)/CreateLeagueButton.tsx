"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

import { SolidButton } from "~/components/buttons/SolidButton";
import { Loading } from "~/components/loading/Loading";

const Drawer = dynamic(() => import("~/components/drawers/Drawer"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

export interface CreateLeagueButtonProps {
  readonly drawer: JSX.Element;
}

export const CreateLeagueButton = ({ drawer }: CreateLeagueButtonProps): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SolidButton.Primary onClick={() => setOpen(true)}>Create League</SolidButton.Primary>
      {open && (
        <Drawer
          title="Create a New League"
          description="Configure your league however you would like."
          open={open}
          onClose={() => setOpen(false)}
          instanceId="create-league-drawer"
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default CreateLeagueButton;
