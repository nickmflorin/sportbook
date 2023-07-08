"use client";
import { Drawer, DrawerProps } from "./Drawer";
import { CreateLeagueForm, CreateLeagueFormProps } from "~/components/forms/league";

export interface CreateLeagueDrawerProps extends Omit<DrawerProps, "children">, Pick<CreateLeagueFormProps, "action"> {}

export const CreateLeagueDrawer = ({ action, ...props }: CreateLeagueDrawerProps): JSX.Element => (
  <Drawer {...props} style={{ width: 400 }}>
    <CreateLeagueForm action={action} />
  </Drawer>
);
