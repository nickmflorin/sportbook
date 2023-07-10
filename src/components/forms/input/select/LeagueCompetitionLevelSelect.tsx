import { Select, type SelectProps, Text, useMantineTheme, type MantineTheme } from "@mantine/core";
import { type TablerIconsProps, IconSocial, IconSportBillard, IconCircleHalf } from "@tabler/icons-react";
import { LeagueCompetitionLevel } from "@prisma/client";

import { SelectOption, type SelectOptionProps } from "./options";

type LeagueCompetitionLevelConfig = {
  readonly label: string;
  readonly icon: React.ComponentType<TablerIconsProps>;
  readonly iconColor: (t: MantineTheme) => string;
};

const LeagueCompetitionLevelConfigs: { [key in LeagueCompetitionLevel]: LeagueCompetitionLevelConfig } = {
  [LeagueCompetitionLevel.COMPETITIVE]: {
    label: "Competitive",
    icon: IconSportBillard,
    iconColor: t => t.colors.green[7],
  },
  [LeagueCompetitionLevel.SOCIAL_COMPETITIVE]: {
    label: "Social/Competitive",
    icon: IconCircleHalf,
    iconColor: t => t.colors.blue[8],
  },
  [LeagueCompetitionLevel.SOCIAL]: {
    label: "Social",
    icon: IconSocial,
    iconColor: t => t.colors.orange[8],
  },
};

type LeagueCompetitionLevelSelectOptionProps = SelectOptionProps & {
  readonly value: LeagueCompetitionLevel;
};

const LeagueCompetitionLevelSelectOption = (
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars -- The value has to be pulled out of spread to not inject into HTML. */
  { value, ...others }: LeagueCompetitionLevelSelectOptionProps,
) => {
  const { icon: Icon, iconColor, label } = LeagueCompetitionLevelConfigs[value];
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

export type LeagueCompetitionLevelSelectProps = Omit<
  SelectProps,
  "data" | "onError" | "rightSection" | "itemComponent" | "valueComponent" | "disableSelectedItemFiltering" | "onChange"
> & {
  readonly onChange?: (v: LeagueCompetitionLevel | null) => void;
};

type LeagueCompetitionLevelAssertion = (value: string) => asserts value is LeagueCompetitionLevel;

const assertIsLeagueCompetitionLevel: LeagueCompetitionLevelAssertion = (value: string) => {
  if (Object.values(LeagueCompetitionLevel).includes(value as LeagueCompetitionLevel)) {
    return value as LeagueCompetitionLevel;
  }
  throw new Error(`Value ${value} is not a valid league type.`);
};

export const LeagueCompetitionLevelSelect = ({ onChange, ...props }: LeagueCompetitionLevelSelectProps) => (
  <Select
    placeholder="Type"
    clearable
    searchable={false}
    {...props}
    onChange={v => {
      if (v) {
        assertIsLeagueCompetitionLevel(v);
        onChange?.(v);
      } else {
        onChange?.(null);
      }
    }}
    data={Object.values(LeagueCompetitionLevel).map(LeagueCompetitionLevel => ({
      ...LeagueCompetitionLevelConfigs[LeagueCompetitionLevel],
      value: LeagueCompetitionLevel,
    }))}
    itemComponent={LeagueCompetitionLevelSelectOption}
  />
);
