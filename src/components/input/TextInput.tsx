"use client";
import { TextInput as RootTextInput, type TextInputProps as RootTextInputProps } from "@mantine/core";

export type TextInputProps = RootTextInputProps;

export const TextInput = (props: TextInputProps): JSX.Element => <RootTextInput {...props} />;
