import dynamic from "next/dynamic";

import { type z } from "zod";

import { logger } from "~/application/logger";
import { type LocationSchema, type Location } from "~/prisma/model";
import { DeleteButton } from "~/components/buttons/DeleteButton";
import { SolidButton } from "~/components/buttons/SolidButton";
import { Text } from "~/components/typography/Text";
import { TileContainer } from "~/components/views/tiles/TileContainer";

const DropdownMenu = dynamic(() => import("~/components/menus/DropdownMenu"), {
  ssr: false,
});

const MultiMenu = dynamic(() => import("~/components/menus/MultiMenu"), {
  ssr: false,
});

type Unsaved = z.output<typeof LocationSchema> & {
  readonly id: `unsaved-${string}`;
};

type Loc = string | Unsaved;

export interface LocationsChooserProps {
  readonly value: (Unsaved | string)[];
  readonly locations: Location[];
  readonly onAdd: () => void;
  readonly onDelete: (id: string) => void;
  readonly onChange: (value: Loc[]) => void;
}

export const LocationsChooser = ({ locations, value, onAdd, onDelete, onChange }: LocationsChooserProps) => (
  <div className="locations-chooser">
    <div className="locations-chooser__locations">
      {value.map((loc, i) => {
        if (typeof loc === "string") {
          const model = locations.find(d => d.id === loc);
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
            <TileContainer direction="row" align="center" key={i} style={{ padding: "6px 8px" }}>
              <Text size="sm" style={{ flexGrow: 100 }}>
                {model.name}
              </Text>
            </TileContainer>
          );
        }
        return (
          <TileContainer direction="row" align="center" key={i} style={{ padding: "6px 8px" }}>
            <Text size="sm" style={{ flexGrow: 100 }}>
              {loc.name}
            </Text>
            <DeleteButton key="0" size="xs" onClick={() => onDelete(loc.id)} />
          </TileContainer>
        );
      })}
    </div>
    <DropdownMenu
      buttonText="Locations"
      buttonWidth="100%"
      menu={
        <MultiMenu
          items={locations.map(loc => ({ value: loc.id, label: loc.name }))}
          value={value.filter((vi): vi is string => typeof vi === "string")}
          onChange={onChange}
          withCheckbox
          footerActions={[
            <SolidButton.Primary size="xs" onClick={() => onAdd()} key="0">
              Add a Location
            </SolidButton.Primary>,
          ]}
        />
      }
    />
  </div>
);
