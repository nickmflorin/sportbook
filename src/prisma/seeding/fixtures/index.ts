import { selectAtRandom } from "../random";

import locations from "./locations.json";
import names from "./names.json";
import sentences from "./sentences.json";
import users from "./users.json";

export const json = {
  locations: locations.locations,
  users: users.users,
  sentences: sentences.sentences,
  names: names.names,
};

export const randomSentence = () => selectAtRandom(json.sentences);
export const randomName = () => selectAtRandom(json.names);
