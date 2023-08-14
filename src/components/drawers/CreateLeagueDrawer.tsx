"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

import { v4 as uuid } from "uuid";

import type * as z from "zod";

import { type LeagueSchema, type Location } from "~/prisma/model";
import { hooks } from "~/components/forms";
import { Loading } from "~/components/loading/Loading";

import { Drawer } from "./Drawer";

const CreateLocationForm = dynamic(() => import("~/components/forms/CreateLocationForm"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

const CreateLeagueForm = dynamic(() => import("~/components/forms/CreateLeagueForm"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

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
      <Drawer onClose={() => setLocationsDrawerOpen(false)} open={locationsDrawerOpen} slot={2} style={{ width: 300 }}>
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
