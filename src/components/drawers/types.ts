import { type EnumeratedLiteralType, enumeratedLiterals } from "~/lib/util/literals";

export const DrawerIds = enumeratedLiterals(["leagueTeam", "createLeague"] as const);
export type DrawerId = EnumeratedLiteralType<typeof DrawerIds>;
