import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

import type * as z from "zod";

import { invitePlayersToTeam } from "~/app/actions/team";
import { isServerErrorResponseBody } from "~/application/response";
import { Form, type FormProps } from "~/components/forms/Form";
import { InviteUsersDropdownSelect } from "~/components/menus/InviteUsersDropdownSelect";
import { InviteUsersTeamDropdownSelect } from "~/components/menus/InviteUsersTeamDropdownSelect";
import { type InvitePlayersSchema } from "~/prisma/model";

export type PlayerFormValues = z.output<typeof InvitePlayersSchema>;

export type InvitePlayersFormProps = Omit<FormProps<PlayerFormValues>, "children"> & {
  readonly leagueId: string;
  readonly requestsDisabled?: boolean;
};

export const InvitePlayersForm = ({ form, leagueId, requestsDisabled }: InvitePlayersFormProps): JSX.Element => {
  const [_, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Form
      submitText="Invite"
      action={async (data, handler) => {
        const response = await invitePlayersToTeam(leagueId, data);
        if (isServerErrorResponseBody(response)) {
          handler.addServerError(response);
        } else {
          form.reset();
          startTransition(() => {
            router.refresh();
          });
        }
      }}
      form={form}
    >
      <Form.ControlledField
        form={form}
        name="userIds"
        label="User"
        description="Select the user or users that you want to invite to the league."
        condition={Form.FieldCondition.REQUIRED}
      >
        {({ field: { onChange, value } }) => (
          <InviteUsersDropdownSelect
            requestDisabled={requestsDisabled}
            leagueId={leagueId}
            value={value}
            onChange={onChange}
            placeholder="Johnny Appleseed"
            onError={e => form.setError("userIds", { message: e })}
          />
        )}
      </Form.ControlledField>
      <Form.ControlledField
        form={form}
        name="teamId"
        label="Team"
        description="Select the team that the users should be invited to."
        condition={Form.FieldCondition.REQUIRED}
      >
        {({ field: { onChange, value } }) => (
          <InviteUsersTeamDropdownSelect
            leagueId={leagueId}
            requestDisabled={requestsDisabled}
            value={value}
            onChange={onChange}
            placeholder="Team Winning"
            onError={e => form.setError("teamId", { message: e })}
          />
        )}
      </Form.ControlledField>
    </Form>
  );
};

export default InvitePlayersForm;
