import { type TeamStats } from "~/prisma/model";
import { Flex, type FlexProps } from "~/components/structural/Flex";

import { Text, type TextProps } from "./Text";

export interface TeamStatsTextProps
  extends Omit<FlexProps, "children" | "direction" | "align">,
    Pick<TextProps, "size"> {
  readonly stats: TeamStats;
}

export const TeamStatsText = ({ stats, size, ...props }: TeamStatsTextProps): JSX.Element => (
  <Flex gap="sm" {...props} direction="row" align="center">
    <Text size={size} color="gray.8" fontWeight="medium">
      {stats.wins.total}
      <Text color="gray.7" span fontWeight="regular" ml="xxs">
        {stats.wins.total === 1 ? "Win" : "Wins"}
      </Text>
    </Text>
    <Text size={size} color="gray.8" fontWeight="medium">
      {stats.losses.total}
      <Text color="gray.7" span fontWeight="regular" ml="xxs">
        {stats.losses.total === 1 ? "Loss" : "Losses"}
      </Text>
    </Text>
    <Text size={size} color="gray.8" fontWeight="medium">
      {stats.ties.total}
      <Text color="gray.7" span fontWeight="regular" ml="xxs">
        {stats.ties.total === 1 ? "Tie" : "Ties"}
      </Text>
    </Text>
  </Flex>
);
