"use client";
import { useState } from "react";

import { v4 as uuid } from "uuid";

import type * as z from "zod";

import { CreateLeagueForm } from "~/components/forms/CreateLeagueForm";
import { CreateLocationForm } from "~/components/forms/CreateLocationForm";
import * as hooks from "~/components/forms/hooks";
import { type LeagueSchema, type Location } from "~/prisma/model";

import { Drawer } from "./Drawer";

export type LeagueFormValues = z.output<typeof LeagueSchema>;

export type CreateLeagueDrawerProps = {
  readonly locations: Location[];
};

export const CreateLeagueDrawer = ({ locations }: CreateLeagueDrawerProps): JSX.Element => {
  const [locationsDrawerOpen, setLocationsDrawerOpen] = useState(false);
  const form = hooks.useLeagueForm();

  return (
    <>
      <CreateLeagueForm locations={locations} onNewLocation={() => setLocationsDrawerOpen(true)} form={form} />
      <Drawer onClose={() => setLocationsDrawerOpen(false)} open={locationsDrawerOpen}>
        <CreateLocationForm
          style={{ marginTop: 12 }}
          onCancel={() => setLocationsDrawerOpen(false)}
          onSubmit={data => {
            const locations = form.getValues("locations");
            form.setValue("locations", [...locations, { ...data, id: `unsaved-${uuid()}` }]);
            setLocationsDrawerOpen(false);
          }}
        />
      </Drawer>
    </>
  );
};

export default CreateLeagueDrawer;
