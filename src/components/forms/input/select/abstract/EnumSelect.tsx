import { Icon } from "~/components/icons";
import { Text } from "~/components/typography";
import { type PrismaEnum, type PrismaEnumValue, type EnumModel, type EnumData } from "~/prisma/enums";

import { SelectOption, type SelectOptionProps } from "../options";

import { Select, type SelectProps } from "./Select";

type EnumSelectOptionProps<E extends PrismaEnum> = SelectOptionProps & {
  readonly value: PrismaEnumValue<E>;
  readonly icon: EnumData<E>["icon"];
  readonly iconColor: EnumData<E>["iconColor"];
  readonly label: EnumData<E>["label"];
};

const EnumSelectOption = <E extends PrismaEnum>(
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars -- The value has to be pulled out of spread to not inject into HTML. */
  { value, iconColor, label, icon, ...others }: EnumSelectOptionProps<E>,
) => (
  <SelectOption withCheckbox={true} {...others}>
    {icon && <Icon size="xs" strokeWidth={1.5} color={iconColor || "gray.7"} icon={icon} style={{ marginRight: 4 }} />}
    <Text color="gray.6" fontWeight="medium" fontSize="xs">
      {label}
    </Text>
  </SelectOption>
);

export type EnumSelectProps<E extends PrismaEnum> = Omit<
  SelectProps<EnumData<E>>,
  | "data"
  | "onError"
  | "rightSection"
  | "itemComponent"
  | "valueComponent"
  | "disableSelectedItemFiltering"
  | "onChange"
  | "value"
> & {
  readonly model: EnumModel<E>;
  readonly value?: PrismaEnumValue<E>;
  readonly onChange?: (v: PrismaEnumValue<E> | null) => void;
};

export const EnumSelect = <E extends PrismaEnum>({ model, onChange, ...props }: EnumSelectProps<E>) => (
  <Select
    clearable
    searchable={false}
    {...props}
    onChange={(v: string | null) => {
      if (v) {
        if (!model.isEnumValue(v)) {
          return model.throwInvalidValue(v);
        }
        onChange?.(v);
      } else {
        onChange?.(null);
      }
    }}
    data={model.data}
    itemComponent={EnumSelectOption}
  />
);
