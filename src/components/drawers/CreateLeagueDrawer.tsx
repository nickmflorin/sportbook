"use client";
import React, { useState } from "react";

import { TextInput, Switch } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { zodResolver } from "@mantine/form";

import type * as z from "zod";

import { LeagueCompetitionLevel, LeagueType, LeagueSchema } from "~/prisma";
import { PrimaryButton } from "~/components/buttons";
import { Form } from "~/components/forms";
import { CreateLocationForm } from "~/components/forms/CreateLocationForm";
import { DrawerForm, type DrawerFormProps } from "~/components/forms/DrawerForm";
import { LeagueTypeSelect, LeagueCompetitionLevelSelect, SportSelect } from "~/components/forms/input";
import { Text } from "~/components/typography";
import { ShowHide } from "~/components/util";

export type LeagueFormInput = z.input<typeof LeagueSchema>;
export type LeagueFormOutput = z.output<typeof LeagueSchema>;

export type CreateLeagueDrawerProps = Omit<DrawerFormProps<LeagueFormInput, LeagueFormOutput>, "children" | "form">;

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

export const CreateLeagueDrawer = ({ action, ...props }: CreateLeagueDrawerProps): JSX.Element => {
  const [hasFiniteDuration, setHasFiniteDuration] = useState(false);
  const [creatingLocation, setCreatingLocation] = useState(false);

  const form = Form.useForm<LeagueFormInput, LeagueFormOutput>({
    validate: zodResolver(LeagueSchema),
    initialValues: getInitialValues(),
  });

  return (
    <div style={{ display: "flex", flexDirection: "row", width: 800 }}>
      <DrawerForm
        {...props}
        form={form}
        style={{ width: 400 }}
        action={action}
        title="Create a New League"
        description="Configure your league however you would like."
        extra={
          <CreateLocationForm
            component="div"
            action={data => {
              console.log({ data });
              form.setFieldValue("locations", [...form.values.locations, data]);
            }}
          />
        }
      >
        <Form.FieldControl form={form} name="name" label="Name" condition={Form.FieldCondition.REQUIRED}>
          <TextInput {...form.getInputProps("name")} placeholder="John Doe" />
        </Form.FieldControl>
        <Form.FieldControl form={form} name="leagueType" label="Type">
          <LeagueTypeSelect {...form.getInputProps("leagueType")} />
        </Form.FieldControl>
        <Form.FieldControl form={form} name="competitionLevel" label="Competition Level">
          <LeagueCompetitionLevelSelect {...form.getInputProps("competitionLevel")} />
        </Form.FieldControl>
        <Form.FieldControl
          form={form}
          name="sport"
          label="Sport"
          description="The sport that will be played in your new league."
        >
          <SportSelect {...form.getInputProps("sport")} />
        </Form.FieldControl>
        <Form.FieldGroupControl form={form} names={["leagueStart", "leagueEnd"]} label="Duration">
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
        </Form.FieldGroupControl>
        {/* <Form.FieldGroup> */}
        <>
          {form.values.locations.map((loc, i) => (typeof loc !== "string" ? <Text key={i}>{loc.name}</Text> : <></>))}
        </>
        <PrimaryButton onClick={() => setCreatingLocation(true)}>Add Location</PrimaryButton>
        {/* <CreateLocationForm
          component="div"
          action={data => {
            console.log({ data });
            form.setFieldValue("locations", [...form.values.locations, data]);
          }}
        /> */}
        {/* </Form.FieldGroup> */}
      </DrawerForm>
      <ShowHide show={creatingLocation}>
        <CreateLocationForm
          component="div"
          action={data => {
            console.log({ data });
            form.setFieldValue("locations", [...form.values.locations, data]);
          }}
        />
      </ShowHide>
    </div>
  );
};
