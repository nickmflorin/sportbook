import { type InitialsString } from "~/lib/util/strings";

export type ImageProp = {
  readonly url?: string | null;
  readonly initials?: InitialsString | null;
  readonly size: number | `${number}`;
};
