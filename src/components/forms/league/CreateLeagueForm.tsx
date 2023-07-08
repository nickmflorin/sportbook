"use client";
import { type League } from "@prisma/client";
import { useForm, zodResolver } from "@mantine/form";

import { LeagueSchema } from "~/prisma/schemas";
import { LeagueForm, LeagueFormProps, type LeagueFormValues, INITIAL_VALUES } from "./LeagueForm";

export type CreateLeagueFormProps = Omit<LeagueFormProps, "onSubmit" | "form"> & {
  readonly onSuccess?: (league: League) => void;
};

export const CreateLeagueForm = ({ onSuccess, ...props }: CreateLeagueFormProps): JSX.Element => {
  const form = useForm<LeagueFormValues>({
    validate: zodResolver(LeagueSchema),
    initialValues: INITIAL_VALUES,
  });
  return (
    <LeagueForm
      {...props}
      form={form}
      // onSubmit={data => mutate(data)}
      // submitting={isLoading}
      // feedback={[{ message: "There was an error creating the league.", visible: isError }]}
    />
  );
};
