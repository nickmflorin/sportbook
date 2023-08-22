"use client";
import { useState } from "react";

import { SolidButton } from "~/components/buttons/SolidButton";
import { Drawer } from "~/components/drawers/Drawer";
import { InfoView } from "~/components/views/InfoView";

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
          open={open}
          onClose={() => setOpen(false)}
          viewProps={{
            header: (
              <InfoView title="Create a New League" description="Configure your league however you would like." />
            ),
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default CreateLeagueButton;
