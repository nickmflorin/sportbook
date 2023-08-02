import { type User, type Location } from "@prisma/client";

export type GetUser = () => User;

export type GetLocation = () => Location;

export type SeedContext = {
  readonly clerkUsers: User[];
  readonly fakeUsers: User[];
  readonly getUser: GetUser;
  readonly getFakeUser: GetUser;
  readonly getClerkUser: GetUser;
  readonly getLocation: GetLocation;
};
