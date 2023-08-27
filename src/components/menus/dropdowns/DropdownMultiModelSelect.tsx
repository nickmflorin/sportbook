import dynamic from "next/dynamic";
import React, { useCallback } from "react";

import { Flex } from "~/components/structural/Flex";
import { type Model } from "~/prisma/model";

import { type MultiMenuType } from "../menus/MultiMenu";

import { type DropdownSelectProps } from "./DropdownSelect";
import { useDropdownSelectControl } from "./hooks";

const DropdownSelect = dynamic(() => import("~/components/menus/dropdowns/DropdownSelect"), {
  ssr: false,
});

const MultiMenu = dynamic(() => import("~/components/menus/menus/MultiMenu")) as MultiMenuType;

export interface DropdownMultiModelSelectProps<M extends Model>
  extends Omit<DropdownSelectProps, "inputPlaceholder" | "valueDisplay" | "inputWidth" | "content"> {
  readonly value: string[];
  readonly data: M[];
  readonly placeholder: string;
  readonly width?: number | string;
  readonly closeOnItemClick?: boolean;
  readonly fetching?: boolean;
  readonly getItemLabel: (m: M) => string;
  readonly getItemIcon?: (m: M) => JSX.Element;
  readonly valueRenderer?: (m: M, count: number) => JSX.Element;
  readonly onChange: (value: string[], datum: M[]) => void;
}

export const DropdownMultiModelSelect = <M extends Model>({
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
}: DropdownMultiModelSelectProps<M>) => {
  const control = useDropdownSelectControl();

  const onChange = useCallback(
    (value: string[], datum: M[]) => {
      if (value.length !== 0 && datum.length !== 0) {
        control.current.setValueDisplay(
          <Flex direction="row" align="center" gap="xs">
            {datum.map((d, i) => (
              <React.Fragment key={i}>
                {valueRenderer === undefined ? getItemLabel(d) : valueRenderer(d, datum.length)}
              </React.Fragment>
            ))}
          </Flex>,
        );
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
      inputPlaceholder={placeholder}
      inputWidth={width}
      control={control}
      onClear={() => onChange([], [])}
      clearDisabled={value.length === 0 || fetching === true}
      content={
        <MultiMenu<string, M>
          items={data.map(m => ({
            value: m.id,
            label: getItemLabel(m),
            icon: getItemIcon?.(m),
            datum: m,
          }))}
          value={value}
          onChange={(value: string[], datum: M[]) => onChange(value, datum)}
          withCheckbox
        />
      }
    />
  );
};

export type DropdownMultiModelSelectType = {
  <M extends Model>(props: DropdownMultiModelSelectProps<M>): JSX.Element;
};

export default DropdownMultiModelSelect;
