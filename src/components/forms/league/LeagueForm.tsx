"use client";
import React from "react";

import { TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { LeagueCompetitionLevel, LeagueType } from "@prisma/client";

import type * as z from "zod";

import { type LeagueSchema } from "~/prisma/schemas";

import { Form, type FormProps } from "../Form";
import { LeagueTypeSelect, LeagueCompetitionLevelSelect, SportSelect } from "../input";

export type LeagueFormValues = z.infer<typeof LeagueSchema>;

export type LeagueFormProps = Omit<FormProps<LeagueFormValues>, "children" | "fieldGap"> & {
  readonly requestDisabled?: boolean;
};

export const LeagueForm = ({ requestDisabled, ...props }: LeagueFormProps): JSX.Element => (
  <Form<LeagueFormValues> {...props} fieldGap="sm">
    <TextInput {...props.form.getInputProps("name")} label="Name" placeholder="John Doe" withAsterisk />
    <LeagueTypeSelect {...props.form.getInputProps("leagueType")} label="Type" />
    <LeagueCompetitionLevelSelect {...props.form.getInputProps("leagueCompeitionLevel")} label="Competition Level" />
    <SportSelect
      requestDisabled={requestDisabled}
      {...props.form.getInputProps("leagueStart")}
      label="Sport"
      onError={() => props.form.setFieldError("sportId", "There was an error loading the sports.")}
    />
    <DateInput {...props.form.getInputProps("leagueStart")} label="Starts" />
    <DateInput {...props.form.getInputProps("leagueEnd")} label="Ends" />
  </Form>
);

export const INITIAL_VALUES: LeagueFormValues = {
  name: "",
  description: "",
  competitionLevel: LeagueCompetitionLevel.SOCIAL,
  leagueType: LeagueType.PICKUP,
  sportId: "",
  locations: [],
};
