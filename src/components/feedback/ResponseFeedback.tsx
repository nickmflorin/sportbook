import { IconDatabase, IconSearch } from "@tabler/icons-react";

import { LocalFeedback, FeedbackLevel } from "~/components/display/feedback";

export interface ResponseFeedbackProps {
  /**
   * Whether or not the {@link LocalFeedback} should be rendered inside of an overlay.
   */
  readonly overlay?: boolean;
  /**
   * Either a {@link boolean} value indicating that an error occurred or an error message, {@link string}.  If provided as {@link true}
   * or a {@link string}, the error message will be shown.
   */
  readonly error?: boolean | string;
  /**
   * A {@link string} error message that should appear in the case that 'error' is provided as a boolean value.
   */
  readonly errorMessage?: string | JSX.Element;
  /**
   * A {@link string} message that should appear in the case that there is no data in the response.  If 'noResultsMessage' is provided, and
   * 'isFiltered' is provided as 'true', the 'noResultsMessage' will take precedence when the component is in an empty state.
   */
  readonly emptyMessage?: string | JSX.Element;
  /**
   * Whether or not the rendered feedback should be indicative of an empty state.
   */
  readonly isEmpty?: boolean;
  /**
   * A message that should be applied in the case that the API returns an empty set of data after search or filter criteria are applied.
   *
   * @see {ResponseFeedback.isFiltered}
   */
  readonly noResultsMessage?: string | JSX.Element;
  /**
   * Whether or not the results are filtered.  Can be provided in the case that the 'noResultsMessage' should be shown instead of the
   * 'emptyMessage' when the API returns an empty set of data after search or filter criteria are applied.
   *
   * @see {ResponseFeedback.noResultsMessage}
   */
  readonly isFiltered?: boolean;
}

/**
 * A component that is used to render feedback local to a component when the component relies on data that is received from an API
 * request, more frequently than not - 'useQuery'.
 */
export const ResponseFeedback = ({
  noResultsMessage = "There are no results.",
  errorMessage = "There was an error loading the data.",
  emptyMessage = "There is no data.",
  isEmpty = false,
  error = false,
  isFiltered = false,
  overlay,
}: ResponseFeedbackProps) => {
  if (error) {
    return (
      <LocalFeedback subtle overlay={overlay} level={FeedbackLevel.ERROR} orientation="vertical">
        {errorMessage}
      </LocalFeedback>
    );
  } else if (isFiltered && isEmpty) {
    return (
      <LocalFeedback subtle overlay={overlay} icon={IconSearch} level={FeedbackLevel.INFO} orientation="vertical">
        {noResultsMessage}
      </LocalFeedback>
    );
  } else if (isEmpty) {
    return (
      <LocalFeedback subtle overlay={overlay} icon={IconDatabase} level={FeedbackLevel.INFO} orientation="vertical">
        {emptyMessage}
      </LocalFeedback>
    );
  }
  return <></>;
};
