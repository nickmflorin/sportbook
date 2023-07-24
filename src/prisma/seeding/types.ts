import { type User, type Location } from "@prisma/client";

export type GetUser = () => User;

export type GetLocation = () => Location;

export type SeedContext = {
  readonly getUser: GetUser;
  readonly getLocation: GetLocation;
};
