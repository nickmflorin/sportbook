import dynamic from "next/dynamic";

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
  readonly value: string;
  readonly data: M[];
  readonly width?: number | string;
  readonly placeholder: string;
  readonly closeOnItemClick?: boolean;
  readonly getItemLabel: (m: M) => string;
  readonly getItemIcon?: (m: M) => JSX.Element;
  readonly valueRenderer?: (m: M) => JSX.Element;
  readonly onChange: (value: string | null, datum: M | null) => void;
}

export const DropdownSingleModelSelect = <M extends Model>({
  data,
  placeholder,
  value,
  width = "100%",
  closeOnItemClick = false,
  getItemLabel,
  getItemIcon,
  onChange,
  valueRenderer,
  ...props
}: DropdownSingleModelSelectProps<M>) => {
  const control = useDropdownSelectControl();
  return (
    <DropdownSelect
      {...props}
      inputWidth={width}
      control={control}
      inputPlaceholder={placeholder}
      content={
        <SingleMenu<string | null, M>
          items={data.map(m => ({
            value: m.id,
            label: getItemLabel(m),
            icon: getItemIcon?.(m),
            datum: m,
          }))}
          value={value}
          onChange={(value: string | null, datum: M | null) => {
            if (value !== null && datum !== null) {
              const valueRendered = valueRenderer === undefined ? getItemLabel(datum) : valueRenderer(datum);
              control.current.setValueDisplay(valueRendered);
            } else {
              control.current.setValueDisplay(null);
            }
            if (closeOnItemClick === true) {
              control.current.close();
            }
            onChange(value, datum);
          }}
        />
      }
    />
  );
};

export default DropdownSingleModelSelect;
