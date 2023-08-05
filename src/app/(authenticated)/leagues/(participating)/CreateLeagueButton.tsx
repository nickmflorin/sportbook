"use client";
import { useRouter, redirect } from "next/navigation";
import { useState, useTransition } from "react";

import { type Location } from "~/prisma/model";
import { SolidButton } from "~/components/buttons/SolidButton";
import { CreateLeagueDrawer } from "~/components/drawers/CreateLeagueDrawer";
import { hooks } from "~/components/forms";
import { createLeague } from "~/app/actions/league";

interface CreateLeagueButtonProps {
  readonly locations: Location[];
}

export const CreateLeagueButton = ({ locations }: CreateLeagueButtonProps): JSX.Element => {
  const [leagueDrawerOpened, setLeagueDrawerOpened] = useState(false);
  const form = hooks.useLeagueForm();
  const router = useRouter();
  const [_, startTransition] = useTransition();

  return (
    <>
      <SolidButton.Primary key="0" onClick={() => setLeagueDrawerOpened(true)}>
        Create League
      </SolidButton.Primary>
      <CreateLeagueDrawer
        form={form}
        locations={locations}
        open={leagueDrawerOpened}
        action={async leagueData => {
          console.log({ leagueData });
          /* await createLeague(leagueData);
             form.reset();
             startTransition(() => {
               router.refresh();
             }); */
        }}
        onClose={() => setLeagueDrawerOpened(false)}
        onCancel={() => setLeagueDrawerOpened(false)}
      />
    </>
  );
};

export default CreateLeagueButton;
