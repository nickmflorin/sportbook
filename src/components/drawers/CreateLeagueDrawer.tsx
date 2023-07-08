"use client";
import { Drawer, DrawerProps } from "./Drawer";
import { CreateLeagueForm } from "~/components/forms/league";

export interface CreateLeagueDrawerProps extends Omit<DrawerProps, "children"> {}

export const CreateLeagueDrawer = (props: CreateLeagueDrawerProps): JSX.Element => (
  <Drawer {...props} style={{ width: 400 }}>
    <CreateLeagueForm />
  </Drawer>
);
