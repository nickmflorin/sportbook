"use server";
import { z } from "zod";

import { ServerResponse, isServerErrorResponseBody } from "~/application/response";
import { getAuthUser } from "~/server/auth";
import { getUserLeagueStaffPermissionCodes } from "~/server/leagues";
import { prisma, isPrismaInvalidIdError, isPrismaDoesNotExistError } from "~/prisma/client";
import {
  GameStatus,
  LeagueStaffPermissionCode,
  type Game,
  type LeagueWithConfigAndPermissionSets,
  CancelGameSchema as _CancelGameSchema,
} from "~/prisma/model";

type ModifyGameStatus = typeof GameStatus.CANCELLED | typeof GameStatus.POSTPONED;

const StatusToPermission: { [key in ModifyGameStatus]: LeagueStaffPermissionCode } = {
  [GameStatus.CANCELLED]: LeagueStaffPermissionCode.CANCEL_GAME,
  [GameStatus.POSTPONED]: LeagueStaffPermissionCode.POSTPONE_GAME,
};

export const validateGameStatusChange = async (id: string, status: ModifyGameStatus) => {
  const user = await getAuthUser();
  if (!user) {
    return ServerResponse.NotAuthenticated("You must be authenticated to create a League.").toJson();
  }

  let game: Game & { readonly league: LeagueWithConfigAndPermissionSets };
  try {
    game = await prisma.game.findUniqueOrThrow({
      where: { id },
      include: {
        league: { include: { config: { include: { staffPermissionSets: true, playerPermissionSets: true } } } },
      },
    });
  } catch (e) {
    if (isPrismaInvalidIdError(e) || isPrismaDoesNotExistError(e)) {
      return ServerResponse.BadRequest("The game with the provided ID does not exist.").toJson();
    } else {
      throw e;
    }
  }
  // The permission code set will be empty if the user is not a staff member for the league.
  const permissionCodes = await getUserLeagueStaffPermissionCodes({ user, league: game.league });
  if (!permissionCodes.includes(StatusToPermission[status])) {
    return ServerResponse.Forbidden().toJson();
  } else if (game.status === status) {
    return ServerResponse.BadRequest(`The game is already in status ${game.status}.`).toJson();
  }
  return { game, user };
};

const PostponeGameSchema = z.object({ id: z.string().uuid() });

export const postponeGame = async (params: z.input<typeof PostponeGameSchema>) => {
  const result = PostponeGameSchema.safeParse(params);
  if (!result.success) {
    /* TODO: We are going to have to develop a more systematic way for server actions to communicate errors based off
       of failed zod validations to the client. */
    const err = result.error.errors[0]?.message || "Bad request.";
    return ServerResponse.BadRequest(err).toJson();
  }
  const validatedResult = await validateGameStatusChange(result.data.id, GameStatus.POSTPONED);
  if (isServerErrorResponseBody(validatedResult)) {
    return validatedResult;
  }
  const { game, user } = validatedResult;
  return await prisma.game.update({
    where: { id: game.id },
    data: { status: GameStatus.POSTPONED, updatedById: user.id },
  });
};

const CancelGameSchema = _CancelGameSchema.extend({ id: z.string().uuid() });

export const cancelGame = async (params: z.input<typeof CancelGameSchema>) => {
  const result = CancelGameSchema.safeParse(params);
  if (!result.success) {
    /* TODO: We are going to have to develop a more systematic way for server actions to communicate errors based off
       of failed zod validations to the client. */
    const err = result.error.errors[0]?.message || "Bad request.";
    return ServerResponse.BadRequest(err).toJson();
  }
  const { id, cancellationReason } = result.data;
  const validatedResult = await validateGameStatusChange(id, GameStatus.CANCELLED);
  if (isServerErrorResponseBody(validatedResult)) {
    return validatedResult;
  }
  const { game, user } = validatedResult;
  return await prisma.game.update({
    where: { id: game.id },
    /* Do we have to worry about empty strings for cancellation reason replacing previous values?  Versus a null value
       which would mean "do not update" the cancellation reason?  We may have to work out some funkiness with Mantine's
       forms and the schemas. */
    data: { status: GameStatus.CANCELLED, updatedById: user.id, cancellationReason },
  });
};
