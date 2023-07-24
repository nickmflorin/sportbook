import { type z } from "zod";

import { logger } from "~/application/logger";
import { type LocationSchema } from "~/prisma/model";
import { DeleteButton } from "~/components/buttons/DeleteButton";
import { LocationTile } from "~/components/views/tiles";
import { useLocations } from "~/app/api/hooks";

import { LocationSelect, type LocationSelectProps } from "./select";

type Unsaved = z.output<typeof LocationSchema>;

type Loc = string | Unsaved;

export interface LocationsChooserProps extends Omit<LocationSelectProps<"multiple">, "loading" | "mode"> {
  readonly value: (Unsaved | string)[];
  readonly initialValue?: Loc[];
  readonly onAdd: (name: string) => void;
  readonly onDelete: (id: string) => void;
}

export const LocationsChooser = ({
  onAdd,
  onError,
  onDelete,
  requestDisabled,
  value,
  ...props
}: LocationsChooserProps) => {
  const { data = [], isLoading } = useLocations({
    isPaused: () => requestDisabled === true,
    onError: err => {
      logger.error({ error: err }, "There was an error loading the sports data used to populate the select.");
      onError?.(err);
    },
    fallbackData: [],
  });

  return (
    <div className="locations-chooser">
      <div className="locations-chooser__locations">
        {value.map((loc, i) => {
          if (typeof loc === "string") {
            const model = data.find(d => d.id === loc);
            if (!model) {
              logger.error(
                { loc },
                `The location with ID '${loc}' could not be found in the data returned from the API for the ` +
                  "locations chooser form field.  This is likely an indication that the API data has been mutated " +
                  "since the first render.",
              );
              return <></>;
            }
            return (
              <LocationTile
                key={i}
                location={model}
                actions={[<DeleteButton key="0" onClick={() => onDelete(loc)} />]}
              />
            );
          }
          return <LocationTile key={i} location={loc} />;
        })}
      </div>
      <LocationSelect
        {...props}
        data={data}
        searchable={true}
        creatable={true}
        shouldCreate={() => true}
        getCreateLabel={() => "Create a New Location"}
        onCreate={query => onAdd(query)}
        loading={isLoading}
        mode="multiple"
      />
    </div>
  );
};
