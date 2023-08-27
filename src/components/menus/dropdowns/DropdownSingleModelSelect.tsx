import dynamic from "next/dynamic";
import React, { useCallback } from "react";

import { type Model } from "~/prisma/model";

import { type SingleMenuType } from "../menus/SingleMenu";

import { type DropdownSelectProps } from "./DropdownSelect";
import { useDropdownSelectControl } from "./hooks";

const DropdownSelect = dynamic(() => import("~/components/menus/dropdowns/DropdownSelect"), {
  ssr: false,
});

const SingleMenu = dynamic(() => import("~/components/menus/menus/SingleMenu"), {
  ssr: false,
}) as SingleMenuType;

export interface DropdownSingleModelSelectProps<M extends Model>
  extends Omit<DropdownSelectProps, "inputPlaceholder" | "valueDisplay" | "inputWidth" | "content"> {
  /* For now, we will assume that single model select values can be nullable - otherwise, it would require a default
     value (or model) which is unlikely to be known for most (if not all) use cases of allowing a user to select a given
     model from a list. */
  readonly value: string | null;
  readonly data: M[];
  readonly width?: number | string;
  readonly placeholder: string;
  readonly closeOnItemClick?: boolean;
  readonly fetching?: boolean;
  readonly getItemLabel: (m: M) => string;
  readonly getItemIcon?: (m: M) => JSX.Element;
  readonly valueRenderer?: (m: M) => JSX.Element;
  readonly onChange: (value: string | null, datum: M | null) => void;
}

export const DropdownSingleModelSelect = <M extends Model>({
  data,
  placeholder,
  value,
  fetching,
  width = "100%",
  closeOnItemClick = false,
  getItemLabel,
  getItemIcon,
  onChange: _onChange,
  valueRenderer,
  ...props
}: DropdownSingleModelSelectProps<M>) => {
  const control = useDropdownSelectControl();

  const onChange = useCallback(
    (value: string | null, datum: M | null) => {
      if (value && datum) {
        const valueRendered = valueRenderer === undefined ? getItemLabel(datum) : valueRenderer(datum);
        control.current.setValueDisplay(valueRendered);
      } else {
        control.current.setValueDisplay(null);
      }
      if (closeOnItemClick === true) {
        control.current.close();
      }
      _onChange(value, datum);
    },
    [_onChange, getItemLabel, valueRenderer, closeOnItemClick, control],
  );

  return (
    <DropdownSelect
      {...props}
      inputWidth={width}
      control={control}
      inputPlaceholder={placeholder}
      onClear={() => onChange(null, null)}
      clearDisabled={value === null || fetching !== true}
      content={
        <SingleMenu<string | null, M>
          items={data.map(m => ({
            value: m.id,
            label: getItemLabel(m),
            icon: getItemIcon?.(m),
            datum: m,
          }))}
          value={value}
          onChange={(value: string | null, datum: M | null) => onChange(value, datum)}
        />
      }
    />
  );
};

export type DropdownSingleModelSelectType = {
  <M extends Model>(props: DropdownSingleModelSelectProps<M>): JSX.Element;
};

export default DropdownSingleModelSelect;
