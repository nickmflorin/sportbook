import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";

import { Switch } from "@mantine/core/lib/Switch";
import { DateInput } from "@mantine/dates/lib/components/DateInput";

import type * as z from "zod";

import { createLeague } from "~/app/actions/league";
import { isServerErrorResponseBody } from "~/application/response";
import { TextInputField } from "~/components/fields/TextInputField";
import { Form, type FormProps } from "~/components/forms/Form";
import { LocationsChooser } from "~/components/input/LocationsChooser";
import { LeagueCompetitionLevelSelect } from "~/components/input/select/LeagueCompetitionLevelSelect";
import { LeagueTypeSelect } from "~/components/input/select/LeagueTypeSelect";
import { SportSelect } from "~/components/input/select/SportSelect";
import { ShowHide } from "~/components/util";
import { type LeagueSchema, type Location } from "~/prisma/model";

export type LeagueFormValues = z.output<typeof LeagueSchema>;

export type CreateLeagueFormProps = Omit<FormProps<LeagueFormValues>, "children"> & {
  readonly locations: Location[];
  readonly onNewLocation: () => void;
};

export const CreateLeagueForm = ({ form, locations, onNewLocation }: CreateLeagueFormProps): JSX.Element => {
  const [hasFiniteDuration, setHasFiniteDuration] = useState(false);

  const [_, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Form
      action={async (leagueData, handler) => {
        const response = await createLeague(leagueData);
        if (isServerErrorResponseBody(response)) {
          handler.addServerError(response);
        } else {
          form.reset();
          startTransition(() => {
            router.refresh();
          });
        }
      }}
      form={form}
    >
      <TextInputField
        form={form}
        name="name"
        label="Name"
        condition={Form.FieldCondition.REQUIRED}
        placeholder="John Doe"
      />
      {/* <Form.ControlledField form={form} name="leagueType" label="Type" condition={Form.FieldCondition.REQUIRED}>
        {({ field: { onChange, value } }) => <LeagueTypeSelect onChange={onChange} value={value} />}
      </Form.ControlledField> */}
      {/* <Form.ControlledField
        form={form}
        name="competitionLevel"
        label="Competition Level"
        condition={Form.FieldCondition.REQUIRED}
      >
        {({ field: { onChange, value } }) => <LeagueCompetitionLevelSelect onChange={onChange} value={value} />}
      </Form.ControlledField> */}
      {/* <Form.ControlledField
        form={form}
        name="sport"
        label="Sport"
        description="The sport that will be played in your new league."
      >
        {({ field: { onChange, value } }) => <SportSelect onChange={onChange} value={value} />}
      </Form.ControlledField> */}
      <Form.FieldGroup form={form} name={["leagueStart", "leagueEnd"]} label="Duration">
        <Switch
          onChange={e => {
            if (e.target.checked === false) {
              form.register("leagueStart");
              form.register("leagueEnd");
            } else {
              form.unregister("leagueStart");
              form.unregister("leagueEnd");
            }
            setHasFiniteDuration(e.target.checked);
          }}
          style={{ marginBottom: 6 }}
        />
        <ShowHide show={hasFiniteDuration}>
          <Form.ControlledField form={form} name="leagueStart" label="Starts">
            {({ field: { onChange, value } }) => <DateInput onChange={onChange} value={value} />}
          </Form.ControlledField>
          <Form.ControlledField form={form} label="Ends" name="leagueStart">
            {({ field: { onChange, value } }) => <DateInput onChange={onChange} value={value} />}
          </Form.ControlledField>
        </ShowHide>
      </Form.FieldGroup>
      {/* <Form.ControlledField
        form={form}
        name="locations"
        label="Locations"
        description="Associate certain locations with your league, either existing locations or new ones."
        condition={Form.FieldCondition.OPTIONAL}
      >
        {({ field: { onChange, value } }) => (
          <LocationsChooser
            value={value}
            locations={locations}
            onChange={onChange}
            onAdd={() => onNewLocation()}
            onDelete={(id: string) => {
              const locations = form.getValues("locations");
              form.setValue(
                "locations",
                locations.filter(v => (typeof v !== "string" ? v.id !== id : v !== id)),
              );
            }}
          />
        )}
      </Form.ControlledField> */}
    </Form>
  );
};

export default CreateLeagueForm;
