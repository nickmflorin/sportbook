import { selectAtRandom } from "../random";

import leagueNames from "./league-names.json";
import locations from "./locations.json";
import names from "./names.json";
import sentences from "./sentences.json";
import teamNames from "./team-names.json";
import users from "./users.json";

export const json = {
  locations: locations.locations,
  users: users.users,
  sentences: sentences.sentences,
  names: names.names,
  teamNames: teamNames.teamNames,
  leagueNames: leagueNames.leagueNames,
};

export const randomSentence = () => selectAtRandom(json.sentences);
export const randomName = () => selectAtRandom(json.names);
export const randomTeamName = () => selectAtRandom(json.teamNames);
export const randomLeagueName = () => selectAtRandom(json.leagueNames);
