"use client";
import React, { useState } from "react";

import { TextInput, Switch } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { zodResolver } from "@mantine/form";

import type * as z from "zod";

import { LeagueCompetitionLevel, LeagueType, LeagueSchema } from "~/prisma";
import { PrimaryButton } from "~/components/buttons";
import { Form, type FormProps, LocationsField } from "~/components/forms";
import { CreateLocationForm } from "~/components/forms/CreateLocationForm";
import { LeagueTypeSelect, LeagueCompetitionLevelSelect, SportSelect } from "~/components/forms/input";
import { Text } from "~/components/typography";
import { ShowHide } from "~/components/util";

import { ManagedDrawers, useManagedDrawers } from "./ManagedDrawers";

export type LeagueFormInput = z.input<typeof LeagueSchema>;
export type LeagueFormOutput = z.output<typeof LeagueSchema>;

export type CreateLeagueDrawerProps = Omit<FormProps<LeagueFormInput, LeagueFormOutput>, "children" | "form"> & {
  readonly open: boolean;
  readonly onClose?: () => void;
};

export const getInitialValues = (): z.input<typeof LeagueSchema> => ({
  name: "",
  description: "",
  competitionLevel: LeagueCompetitionLevel.SOCIAL,
  leagueType: LeagueType.PICKUP,
  sport: null,
  locations: [],
  leagueStart: null,
  leagueEnd: null,
});

export const CreateLeagueDrawer = ({ action, open, onClose, ...props }: CreateLeagueDrawerProps): JSX.Element => {
  const [hasFiniteDuration, setHasFiniteDuration] = useState(false);
  const handler = useManagedDrawers<"locations">();

  const form = Form.useForm<LeagueFormInput, LeagueFormOutput>({
    validate: zodResolver(LeagueSchema),
    initialValues: getInitialValues(),
  });

  return (
    <ManagedDrawers
      open={open}
      onClose={onClose}
      handler={handler}
      alwaysOpen={["primary"]}
      drawers={{
        primary: (
          <Form
            {...props}
            form={form}
            style={{ width: 400 }}
            action={action}
            title="Create a New League"
            description="Configure your league however you would like."
          >
            <Form.Field form={form} name="name" label="Name" condition={Form.FieldCondition.REQUIRED}>
              <TextInput {...form.getInputProps("name")} placeholder="John Doe" />
            </Form.Field>
            <Form.Field form={form} name="leagueType" label="Type">
              <LeagueTypeSelect {...form.getInputProps("leagueType")} />
            </Form.Field>
            <Form.Field form={form} name="competitionLevel" label="Competition Level">
              <LeagueCompetitionLevelSelect {...form.getInputProps("competitionLevel")} />
            </Form.Field>
            <Form.Field
              form={form}
              name="sport"
              label="Sport"
              description="The sport that will be played in your new league."
            >
              <SportSelect {...form.getInputProps("sport")} />
            </Form.Field>
            <Form.FieldGroup form={form} name={["leagueStart", "leagueEnd"]} label="Duration">
              <Switch
                onChange={e => {
                  if (e.target.checked === false) {
                    form.setFieldValue("leagueStart", getInitialValues().leagueStart);
                    form.setFieldValue("leagueEnd", getInitialValues().leagueEnd);
                  }
                  setHasFiniteDuration(e.target.checked);
                }}
                style={{ marginBottom: 6 }}
              />
              <ShowHide show={hasFiniteDuration}>
                <Form.Field label="Starts">
                  <DateInput {...form.getInputProps("leagueStart")} />
                </Form.Field>
                <Form.Field label="Ends">
                  <DateInput {...form.getInputProps("leagueEnd")} />
                </Form.Field>
              </ShowHide>
            </Form.FieldGroup>
            <>
              {form.values.locations.map((loc, i) =>
                typeof loc !== "string" ? <Text key={i}>{loc.name}</Text> : <></>,
              )}
            </>
            <LocationsField
              {...form.getInputProps("locations")}
              name="locations"
              form={form}
              requestDisabled={!open}
              label="Locations"
              condition="optional"
              description="What locations are associated with this league?"
              onAdd={() => handler.current.open("locations")}
            />
            <PrimaryButton onClick={() => handler.current.open("locations")}>Add Location</PrimaryButton>
          </Form>
        ),
        locations: <CreateLocationForm style={{ width: 300 }} />,
      }}
    />
  );
};
