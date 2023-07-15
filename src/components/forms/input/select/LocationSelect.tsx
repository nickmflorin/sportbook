import { type Optional } from "utility-types";

import { logger } from "~/internal/logger";
import { useLocations } from "~/lib/api";
import { type Location } from "~/prisma";

import { ModelSelect, type ModelSelectProps } from "./abstract";

export interface LocationSelectProps
  extends Optional<Omit<ModelSelectProps<Location>, "loading" | "getLabel" | "model">, "data"> {
  /**
   * Whether or not the request to load the data should be disabled.  Used for cases where the select is in a drawer
   * and the drawer is not yet open.
   */
  readonly requestDisabled?: boolean;
  readonly onError?: (err: Error) => void;
}

export const LocationSelect = ({ requestDisabled, onError, data, ...props }: LocationSelectProps) => {
  const { data: _data = [], isLoading } = useLocations({
    isPaused: () => data !== undefined || requestDisabled === true,
    onError: err => {
      logger.error({ error: err }, "There was an error loading the sports data used to populate the select.");
      onError?.(err);
    },
    fallbackData: [],
  });
  return (
    <ModelSelect
      placeholder="Location"
      {...props}
      loading={isLoading}
      data={data === undefined ? _data : data}
      getLabel={option => option.model.name}
    />
  );
};
