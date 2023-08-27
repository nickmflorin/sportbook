export type IDropdownControl = {
  readonly close: () => void;
  readonly open: () => void;
};

export type IDropdownSelectControl = IDropdownControl & {
  readonly setValueDisplay: (content: string | JSX.Element | null) => void;
};
