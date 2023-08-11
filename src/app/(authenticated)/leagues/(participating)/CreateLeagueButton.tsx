"use client";
import { SolidButton } from "~/components/buttons/SolidButton";
import { useDrawer, type DrawerRenderer } from "~/components/drawers/useDrawer";

export interface CreateLeagueButtonProps {
  readonly renderDrawer: DrawerRenderer;
}

export const CreateLeagueButton = ({ renderDrawer }: CreateLeagueButtonProps): JSX.Element => {
  const { drawer, open } = useDrawer({
    render: renderDrawer,
    title: "Create a New League",
    description: "Configure your league however you would like.",
  });

  return (
    <>
      <SolidButton.Primary key="0" onClick={() => open()}>
        Create League
      </SolidButton.Primary>
      {drawer}
    </>
  );
};

export default CreateLeagueButton;
