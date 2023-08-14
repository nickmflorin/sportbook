"use client";
import { SolidButton } from "~/components/buttons/SolidButton";
import { type DrawerRenderer } from "~/components/drawers";
import { useDrawer } from "~/components/drawers/useDrawer";

export interface CreatePlayerButtonProps {
  readonly renderDrawer: DrawerRenderer;
}

export const CreatePlayerButton = ({ renderDrawer }: CreatePlayerButtonProps): JSX.Element => {
  const { drawer, open } = useDrawer({
    renderer: renderDrawer,
    drawerProps: { title: "Create a New Player", description: "Add a player to any team in the league." },
  });

  return (
    <>
      <SolidButton.Primary onClick={() => open()}>Create Player</SolidButton.Primary>
      {drawer}
    </>
  );
};

export default CreatePlayerButton;
