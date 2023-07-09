"use client";
import { CreateLeagueForm, type CreateLeagueFormProps } from "~/components/forms/league";

import { Drawer, type DrawerProps } from "./Drawer";

export interface CreateLeagueDrawerProps extends Omit<DrawerProps, "children">, Pick<CreateLeagueFormProps, "action"> {}

export const CreateLeagueDrawer = ({ action, ...props }: CreateLeagueDrawerProps): JSX.Element => (
  <Drawer {...props} style={{ width: 400 }}>
    <CreateLeagueForm action={action} />
  </Drawer>
);
