import { type Optional } from "utility-types";

import { logger } from "~/application/logger";
import { type Location } from "~/prisma/model";
import { useLocations } from "~/app/api/hooks";

import { AsyncModelSelect, type AsyncModelSelectProps, type SelectMode } from "./abstract";

export interface LocationSelectProps<M extends SelectMode>
  extends Optional<
    Omit<AsyncModelSelectProps<Pick<Location, "id" | "name" | "description">, M>, "getLabel" | "model">,
    "data"
  > {
  /**
   * Whether or not the request to load the data should be disabled.  Used for cases where the select is in a drawer
   * and the drawer is not yet open.
   */
  readonly requestDisabled?: boolean;
  readonly onError?: (err: Error) => void;
}

export const LocationSelect = <M extends SelectMode>({
  requestDisabled,
  onError,
  data,
  ...props
}: LocationSelectProps<M>) => {
  const { data: _data = [], isLoading } = useLocations({
    isPaused: () => data !== undefined || requestDisabled === true,
    onError: err => {
      logger.error({ error: err }, "There was an error loading the sports data used to populate the select.");
      onError?.(err);
    },
    fallbackData: [],
  });
  return (
    <AsyncModelSelect
      placeholder="Location"
      {...props}
      loading={isLoading}
      data={data === undefined ? _data : data}
      getLabel={loc => loc.name}
    />
  );
};
