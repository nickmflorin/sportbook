"use client";
import React, { useState } from "react";

import { TextInput, Switch } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { zodResolver } from "@mantine/form";

import type * as z from "zod";

import { LeagueCompetitionLevel, LeagueType, LeagueSchema } from "~/prisma";
import { Form } from "~/components/forms";
import { LeagueTypeSelect, LeagueCompetitionLevelSelect, SportSelect } from "~/components/forms/input";
import { ShowHide } from "~/components/util";

import { DrawerForm, type DrawerFormProps } from "./DrawerForm";

export type LeagueFormInput = z.input<typeof LeagueSchema>;
export type LeagueFormOutput = z.output<typeof LeagueSchema>;

export type LeagueFormProps = Omit<DrawerFormProps<LeagueFormInput, LeagueFormOutput>, "children"> & {
  readonly requestDisabled?: boolean;
};

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

  const form = Form.useForm<LeagueFormInput, LeagueFormOutput>({
    validate: zodResolver(LeagueSchema),
    initialValues: getInitialValues(),
  });

  return (
    <DrawerForm<LeagueFormInput, LeagueFormOutput>
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
      <Switch onChange={e => setHasFiniteDuration(e.target.checked)}></Switch>
      <ShowHide show={hasFiniteDuration}>
        <DateInput {...form.getInputProps("leagueStart")} label="Starts" />
        <DateInput {...form.getInputProps("leagueEnd")} label="Ends" />
      </ShowHide>
    </DrawerForm>
  );
};
