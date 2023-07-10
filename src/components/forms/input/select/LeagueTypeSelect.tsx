import { Select, type SelectProps, Text, useMantineTheme, type MantineTheme } from "@mantine/core";
import { type TablerIconsProps, IconSocial, IconSportBillard } from "@tabler/icons-react";
import { LeagueType } from "@prisma/client";

import { SelectOption, type SelectOptionProps } from "./options";

type LeagueTypeConfig = {
  readonly label: string;
  readonly icon: React.ComponentType<TablerIconsProps>;
  readonly iconColor: (t: MantineTheme) => string;
};

const LeagueTypeConfigs: { [key in LeagueType]: LeagueTypeConfig } = {
  [LeagueType.PICKUP]: {
    label: "Pickup",
    icon: IconSocial,
    iconColor: t => t.colors.green[7],
  },
  [LeagueType.ORGANIZED]: {
    label: "Organized",
    icon: IconSportBillard,
    iconColor: t => t.colors.orange[8],
  },
};

type LeagueTypeSelectOptionProps = SelectOptionProps & {
  readonly value: LeagueType;
};

const LeagueTypeSelectOption = (
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars -- The value has to be pulled out of spread to not inject into HTML. */
  { value, ...others }: LeagueTypeSelectOptionProps,
) => {
  const { icon: Icon, iconColor, label } = LeagueTypeConfigs[value];
  const theme = useMantineTheme();

  return (
    <SelectOption withCheckbox={true} {...others}>
      <Icon size={14} stroke={1.5} color={iconColor(theme)} />
      <Text ml="xs" color="dimmed" fz="xs" sx={t => ({ fontWeight: t.other.fontWeights.medium })}>
        {label}
      </Text>
    </SelectOption>
  );
};

export type LeagueTypeSelectProps = Omit<
  SelectProps,
  "data" | "onError" | "rightSection" | "itemComponent" | "valueComponent" | "disableSelectedItemFiltering" | "onChange"
> & {
  readonly onChange?: (v: LeagueType | null) => void;
};

type LeagueTypeAssertion = (value: string) => asserts value is LeagueType;

const assertIsLeagueType: LeagueTypeAssertion = (value: string) => {
  if (Object.values(LeagueType).includes(value as LeagueType)) {
    return value as LeagueType;
  }
  throw new Error(`Value ${value} is not a valid league type.`);
};

export const LeagueTypeSelect = ({ onChange, ...props }: LeagueTypeSelectProps) => (
  <Select
    placeholder="Type"
    clearable
    searchable={false}
    {...props}
    onChange={v => {
      if (v) {
        assertIsLeagueType(v);
        onChange?.(v);
      } else {
        onChange?.(null);
      }
    }}
    data={Object.values(LeagueType).map(LeagueType => ({ ...LeagueTypeConfigs[LeagueType], value: LeagueType }))}
    itemComponent={LeagueTypeSelectOption}
  />
);
