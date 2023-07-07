"use client";
import React, { useEffect } from "react";

import { TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { type League, LeagueCompetitionLevel, LeagueType } from "@prisma/client";

import type * as z from "zod";

import { LeagueSchema } from "~/prisma/schemas";

import { Form, type FormProps } from "../Form";
import { LeagueTypeSelect, LeagueCompetitionLevelSelect } from "../input";

type LeagueFormValues = z.infer<typeof LeagueSchema>;

export type LeagueFormProps = Omit<FormProps<LeagueFormValues>, "children" | "fieldGap">;

export const LeagueForm = (props: LeagueFormProps): JSX.Element => (
  <Form<LeagueFormValues> {...props} fieldGap="sm">
    <TextInput {...props.form.getInputProps("name")} label="Name" placeholder="John Doe" withAsterisk />
    <LeagueTypeSelect {...props.form.getInputProps("leagueType")} label="Type" />
    <LeagueCompetitionLevelSelect {...props.form.getInputProps("leagueCompeitionLevel")} label="Competition Level" />
    <DateInput {...props.form.getInputProps("leagueStart")} label="Starts" />
    <DateInput {...props.form.getInputProps("leagueEnd")} label="Ends" />
  </Form>
);

const INITIAL_VALUES: LeagueFormValues = {
  name: "",
  description: "",
  competitionLevel: LeagueCompetitionLevel.SOCIAL,
  leagueType: LeagueType.PICKUP,
  sportId: "",
  locations: [],
};

export type CreateLeagueFormProps = Omit<LeagueFormProps, "onSubmit" | "form"> & {
  readonly onSuccess?: (league: League) => void;
};

export const CreateLeagueForm = ({ onSuccess, ...props }: CreateLeagueFormProps): JSX.Element => {
  const { mutate, isError, isLoading } = api.customers.contacts.create.useMutation({ onSuccess });
  const form = useForm<LeagueFormValues>({
    validate: zodResolver(LeagueSchema),
    initialValues: INITIAL_VALUES,
  });
  return (
    <LeagueForm
      {...props}
      form={form}
      onSubmit={data => mutate({ customerId, ...data })}
      submitting={isLoading}
      feedback={[{ message: "There was an error creating the league.", visible: isError }]}
    />
  );
};
