import { useState, experimental_useOptimistic as useOptimistic } from "react";

import { type z } from "zod";

import { logger } from "~/internal/logger";
import { useLocations } from "~/lib/api";
import { type Location, type LocationSchema } from "~/prisma";
import { AddIcon } from "~/components/display/icons";
import { Text } from "~/components/typography";

import { LocationSelect, type LocationSelectProps } from "./select";

type Loc = Location | z.output<typeof LocationSchema>;

export interface LocationsChooserProps extends Omit<LocationSelectProps<"multiple">, "loading" | "mode" | "onChange"> {
  readonly value?: Loc[];
  readonly initialValue?: Loc[];
  readonly onChange?: (locations: Loc[]) => void;
  readonly onAdd: (name: string) => void;
}

/* enum LocationsActionType {
     CHANGED = "changed",
   } */

/* type LocationsChangedAction = {
     readonly type: LocationsActionType.CHANGED;
     readonly locations: Location[];
   }; */

// type LocationsAction = LocationsChangedAction;

/* const locationsReducer = (state: Loc[], action: { type: "add" | "remove"; payload: Loc }) => {
     switch(action.type) {
       case LocationsActionType.CHANGED:
         return state.reduce((prev: Loc[], curr: Location) => {
         }, [])
     }
   } */

export const LocationsChooser = ({
  onAdd,
  onError,
  requestDisabled,
  initialValue = [],
  value,
  ...props
}: LocationsChooserProps) => {
  const [_locations, setLocations] = useState<Loc[]>(initialValue);

  const locations = value === undefined ? _locations : value;

  const { data: _data = [], isLoading } = useLocations({
    isPaused: () => requestDisabled === true,
    onError: err => {
      logger.error({ error: err }, "There was an error loading the sports data used to populate the select.");
      onError?.(err);
    },
    fallbackData: [],
  });

  return (
    <div className="locations-chooser">
      <>
        {locations.map((loc, i) => (
          <Text key={i}>{loc.name}</Text>
        ))}
      </>
      <div className="locations-chooser__select-wrapper">
        <LocationSelect
          {...props}
          data={_data}
          searchable={true}
          creatable={true}
          shouldCreate={() => true}
          getCreateLabel={() => "Create a New Location"}
          onCreate={query => onAdd(query)}
          loading={isLoading}
          mode="multiple"
          onChange={(value, data) => {
            setLocations(data.map(d => d.model.model));
          }}
        />
      </div>
    </div>
  );
};
