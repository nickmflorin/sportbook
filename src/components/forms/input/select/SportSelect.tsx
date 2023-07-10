import { type Sport } from "@prisma/client";

import { logger } from "~/internal/logger";
import { useSports } from "~/lib/api";

import { ModelSelect, type ModelSelectProps } from "./abstract";

export interface SportSelectProps extends Omit<ModelSelectProps<Sport>, "loading" | "data" | "getLabel"> {
  /**
   * Whether or not the request to load the data should be disabled.  Used for cases where the select is in a drawer
   * and the drawer is not yet open.
   */
  readonly requestDisabled?: boolean;
  readonly onError?: (err: Error) => void;
}

export const SportSelect = ({ requestDisabled, onError, ...props }: SportSelectProps) => {
  const { data = [], isLoading } = useSports({
    isPaused: () => requestDisabled === true,
    onError: err => {
      logger.error({ error: err }, "There was an error loading the sports data used to populate the select.");
      onError?.(err);
    },
    fallbackData: [],
  });
  return <ModelSelect placeholder="Sport" {...props} loading={isLoading} data={data} getLabel={sport => sport.name} />;
};
