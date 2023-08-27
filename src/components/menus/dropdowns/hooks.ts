import { useRef } from "react";

import { type IDropdownControl, type IDropdownSelectControl } from "./types";

export const useDropdownControl = (
  existing?: React.MutableRefObject<IDropdownControl>,
): React.MutableRefObject<IDropdownControl> => {
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  const initial = useRef<IDropdownControl>({ close: () => {}, open: () => {} });
  return existing || initial;
};

export const useDropdownSelectControl = (
  existing?: React.MutableRefObject<IDropdownSelectControl>,
): React.MutableRefObject<IDropdownSelectControl> =>
  useRef<IDropdownSelectControl>({
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    setValueDisplay: () => {},
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    close: () => {},
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    open: () => {},
    ...existing?.current,
  });
