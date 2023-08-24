"use client";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";

import { SolidButton } from "~/components/buttons/SolidButton";

const InfoView = dynamic(() => import("~/components/views/InfoView"), { ssr: false });

export interface CreateLeagueButtonProps {
  readonly drawer: JSX.Element;
}

export const CreateLeagueButton = ({ drawer }: CreateLeagueButtonProps): JSX.Element => {
  const [content, setContent] = useState<JSX.Element | null>(null);
  const [rendering, setRendering] = useState(false);

  const setOpen = useCallback(
    async (value: boolean) => {
      if (value === true) {
        setRendering(true);
        const { Drawer } = await import("~/components/drawers/Drawer");
        setContent(
          <Drawer
            open={true}
            onClose={() => setContent(null)}
            viewProps={{
              header: (
                <InfoView title="Create a New League" description="Configure your league however you would like." />
              ),
            }}
          >
            {drawer}
          </Drawer>,
        );
        setRendering(false);
      } else {
        setContent(null);
      }
    },
    [drawer],
  );

  return (
    <>
      <SolidButton.Primary loading={rendering} disabled={content !== null} onClick={() => setOpen(true)}>
        Create League
      </SolidButton.Primary>
      {content}
    </>
  );
};

export default CreateLeagueButton;
