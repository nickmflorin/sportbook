import { useState } from "react";

import { type z } from "zod";

import { type Location, type LocationSchema } from "~/prisma";
import { AddButton } from "~/components/buttons";
import { Text } from "~/components/typography";

import { LocationSelect } from "../input";
import { type BaseFormValues, type FormKeys } from "../types";

import { Field, type FormFieldProps } from "./Field";

type Loc = Location["id"] | z.output<typeof LocationSchema>;

export interface LocationsFieldProps<K extends FormKeys<I>, I extends BaseFormValues, O extends BaseFormValues>
  extends Omit<FormFieldProps<K, I, O>, "actions" | "children"> {
  readonly value?: Loc[];
  readonly requestDisabled?: boolean;
  readonly onAdd?: () => void;
  readonly onChange?: (v: Loc[]) => void;
}

export const LocationsField = <K extends FormKeys<I>, I extends BaseFormValues, O extends BaseFormValues>({
  value = [],
  onChange,
  onAdd,
  ...props
}: LocationsFieldProps<K, I, O>) => {
  const [_locations, setLocations] = useState<Loc[]>(value);
  return (
    <Field label="Locations" {...props} actions={onAdd ? [<AddButton key="0" onClick={() => onAdd()} />] : undefined}>
      <>{_locations.map((loc, i) => (typeof loc === "string" ? <></> : <Text key={i}>{loc.name}</Text>))}</>
      <LocationSelect
        onChange={(value, location) => {
          // Some of this will be cleared up more whne it becomes a multi select I think.
          if (location !== null) {
            // TODO: Make sure location is not already in the set.
            setLocations(v => [...v, location.id]);
            // There has to be a better way to do this.
            onChange?.([..._locations, location.id]);
          }
        }}
      />
    </Field>
  );
};
