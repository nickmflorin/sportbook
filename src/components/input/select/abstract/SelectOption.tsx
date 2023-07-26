import { forwardRef } from "react";

import { Checkbox } from "@mantine/core";
import classNames from "classnames";

import { pluckObjAttributes } from "~/lib/util";

type BaseSelectOptionProps = {
  readonly disabled?: boolean;
  readonly selected?: boolean;
};

type SelectOptionOptions = {
  readonly withCheckbox?: boolean;
};

type SelectOptionProps = React.ComponentPropsWithoutRef<"div"> & BaseSelectOptionProps & SelectOptionOptions;

type WithSelectOptionValue<T, V> = T & {
  readonly label: string;
  readonly value: V;
};

export type WithSelectOptionProps<T, V> = WithSelectOptionValue<T & BaseSelectOptionProps, V>;

export const SelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(function SelectOption(
  { children, withCheckbox, disabled, selected, ...props },
  ref,
) {
  return (
    <div {...props} className={classNames("select__option", { disabled, selected }, props.className)} ref={ref}>
      {withCheckbox && <Checkbox readOnly checked={selected} mr="md" size={14} />}
      {children}
    </div>
  );
});

export const createSelectOption = <T, V>(
  names: (keyof T)[],
  renderer: (params: WithSelectOptionValue<T, V>) => JSX.Element,
  options?: SelectOptionOptions,
) =>
  forwardRef<HTMLDivElement, WithSelectOptionProps<T, V>>(function CustomSelectOption(props, ref) {
    const [params, originalProps] = pluckObjAttributes(props, ["value", "label", ...names]);
    return (
      <SelectOption {...originalProps} {...options} ref={ref}>
        {renderer(params)}
      </SelectOption>
    );
  });
