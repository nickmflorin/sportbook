"use client";
import { Checkbox as RootCheckbox, type CheckboxProps as RootCheckboxProps } from "@mantine/core";

export type CheckboxProps = RootCheckboxProps;

export const Checkbox = (props: CheckboxProps): JSX.Element => <RootCheckbox {...props} />;
