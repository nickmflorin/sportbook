"use client";
import React, { useState } from "react";

import { TextInput, Switch } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { zodResolver } from "@mantine/form";
import { LeagueCompetitionLevel, LeagueType } from "@prisma/client";

import type * as z from "zod";

import { LeagueSchema } from "~/prisma/schemas";
import { Form, type FormInitialValues } from "~/components/forms";
import { LeagueTypeSelect, LeagueCompetitionLevelSelect, SportSelect } from "~/components/forms/input";
import { ShowHide } from "~/components/util";

import { DrawerForm, type DrawerFormProps } from "./DrawerForm";

export type LeagueFormValues = z.infer<typeof LeagueSchema>;

export type LeagueFormProps = Omit<DrawerFormProps<LeagueFormValues>, "children"> & {
  readonly requestDisabled?: boolean;
};

export type CreateLeagueDrawerProps = Omit<DrawerFormProps<LeagueFormValues>, "children" | "form">;

export const getInitialValues = (): FormInitialValues<LeagueFormValues> => ({
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

  const form = Form.useForm<LeagueFormValues>({
    validate: zodResolver(LeagueSchema),
    initialValues: getInitialValues(),
  });

  return (
    <DrawerForm<LeagueFormValues>
      {...props}
      form={form}
      style={{ width: 400 }}
      action={action}
      title="Create a New League"
      subTitle="A league can be used to play sports together."
    >
      <Form.Field form={form} name="name" label="Name" condition={Form.FieldCondition.REQUIRED}>
        <TextInput {...form.getInputProps("name")} placeholder="John Doe" />
      </Form.Field>
      <Form.Field form={form} name="leagueType" label="Type">
        <LeagueTypeSelect {...form.getInputProps("leagueType")} />
      </Form.Field>
      <Form.Field form={form} name="leagueTleagueCompetitionLevelype" label="Competition Level">
        <LeagueCompetitionLevelSelect {...form.getInputProps("leagueCompetitionLevel")} />
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
