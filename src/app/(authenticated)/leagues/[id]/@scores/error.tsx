"use client";

import { logger } from "~/application/logger";
import { AlternateButton } from "~/components/buttons/AlternateButton";
import { ErrorView } from "~/components/feedback/views/ErrorView";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  logger.error(error);
  return (
    <ErrorView
      description="There was an error loading the scores."
      link={<AlternateButton.Primary onClick={() => reset()}>Try Again</AlternateButton.Primary>}
    />
  );
}
