"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { SolidButton } from "~/components/buttons/SolidButton";
import { CreateLeagueDrawer } from "~/components/drawers/CreateLeagueDrawer";
import { hooks } from "~/components/forms";
import { createLeague } from "~/app/actions/league";

export const CreateLeagueButton = (): JSX.Element => {
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
        open={leagueDrawerOpened}
        action={async leagueData => {
          await createLeague(leagueData);
          form.reset();
          startTransition(() => {
            router.refresh();
          });
        }}
        onClose={() => setLeagueDrawerOpened(false)}
        onCancel={() => setLeagueDrawerOpened(false)}
      />
    </>
  );
};

export default CreateLeagueButton;
