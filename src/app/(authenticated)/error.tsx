"use client";
import { logger } from "~/internal/logger";
import { ErrorView } from "~/components/feedback/views/ErrorView";

export default function Error({ error }: { error: Error }) {
  logger.error(error);
  return <ErrorView description="There was an error loading the page." />;
}
