import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

import type * as z from "zod";

import { invitePlayersToTeam } from "~/app/actions/team";
import { isServerErrorResponse } from "~/application/errors";
import { type InvitePlayersSchema, type Team, type User } from "~/prisma/model";
import { Form, type FormProps } from "~/components/forms/Form";
import { TeamDropdownMenu } from "~/components/menus/TeamDropdownMenu";
import { UsersDropdownMenu } from "~/components/menus/UsersDropdownMenu";

export type PlayerFormValues = z.output<typeof InvitePlayersSchema>;

export type InvitePlayersFormProps = Omit<FormProps<PlayerFormValues>, "children"> & {
  readonly leagueId: string;
  readonly teams: Team[];
  readonly users: User[];
};

export const InvitePlayersForm = ({ form, leagueId, teams, users }: InvitePlayersFormProps): JSX.Element => {
  const [_, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Form
      action={async (data, handler) => {
        const response = await invitePlayersToTeam(leagueId, data);
        if (isServerErrorResponse(response)) {
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
        description="Select the user that should be invited to the league."
        condition={Form.FieldCondition.REQUIRED}
      >
        {({ field: { onChange, value } }) => <UsersDropdownMenu value={value} users={users} onChange={onChange} />}
      </Form.ControlledField>
      <Form.ControlledField
        form={form}
        name="teamId"
        label="Team"
        description="Select the team that the users should be invited to."
        condition={Form.FieldCondition.REQUIRED}
      >
        {({ field: { onChange, value } }) => <TeamDropdownMenu value={value} teams={teams} onChange={onChange} />}
      </Form.ControlledField>
    </Form>
  );
};

export default InvitePlayersForm;
