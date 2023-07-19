"use client";

import { logger } from "~/internal/logger";
import { AlternateButton } from "~/components/buttons";
import { ErrorView } from "~/components/feedback/views/ErrorView";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  logger.error(error);
  return (
    <ErrorView
      description="There was an error loading the league."
      link={<AlternateButton.Primary onClick={() => reset()}>Try Again</AlternateButton.Primary>}
    />
  );
}
