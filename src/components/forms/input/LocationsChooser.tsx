import { useState } from "react";

import { type z } from "zod";

import { logger } from "~/internal/logger";
import { useLocations } from "~/lib/api";
import { type Location, type LocationSchema } from "~/prisma";
import { LocationTile } from "~/components/display/tiles";

import { LocationSelect, type LocationSelectProps } from "./select";

type UnsavedLocation = z.output<typeof LocationSchema> & {
  readonly id: `unsaved-${string}`;
};
type Loc = string | UnsavedLocation;

const locIsUnsaved = (loc: Loc): loc is UnsavedLocation => typeof loc !== "string" && loc.id.startsWith("unsaved-");

export interface LocationsChooserProps extends Omit<LocationSelectProps<"multiple">, "loading" | "mode"> {
  readonly value: Loc[];
  readonly initialValue?: Loc[];
  readonly onAdd: (name: string) => void;
}

export const LocationsChooser = ({
  onAdd,
  onError,
  /* unsaved,
     onChange, */
  requestDisabled,
  value,
  ...props
}: LocationsChooserProps) => {
  // const [_value, setValue] = useState<Loc[]>(initialValue);

  // const overallValue = value === undefined ? _value : value;

  const { data: _data = [], isLoading } = useLocations({
    isPaused: () => requestDisabled === true,
    onError: err => {
      logger.error({ error: err }, "There was an error loading the sports data used to populate the select.");
      onError?.(err);
    },
    fallbackData: [],
  });

  const locations: (Location | UnsavedLocation)[] = [
    ..._data,
    ...value.filter((vi): vi is UnsavedLocation => locIsUnsaved(vi)),
  ];

  return (
    <div className="locations-chooser">
      <div className="locations-chooser__locations">
        {value.map((loc, i) => {
          const model = _data.find(d => d.id === loc);
          if (!model) {
            logger.error("");
            return <></>;
          }
          return <LocationTile key={i} model={model} />;
        })}
      </div>
      <LocationSelect
        {...props}
        data={locations}
        searchable={true}
        creatable={true}
        shouldCreate={() => true}
        getCreateLabel={() => "Create a New Location"}
        onCreate={query => onAdd(query)}
        loading={isLoading}
        mode="multiple"
        // onChange={(value, data) => {

        // }}
        /* onChange={(value, data) => {
             // setValue(data.map(d => d.model.model));
             onChange?.(data.map(d => d.model.value));
           }} */
      />
    </div>
  );
};
