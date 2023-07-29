"use client";
import { TextInput as RootTextInput, type TextInputProps as RootTextInputProps } from "@mantine/core";

export type TextInputProps = RootTextInputProps;

/* Eventually, this will be replaced with an internally created TextInput element.  For now, we will just use Mantine's
   and try to make it look close to what ours should look like - based on the characteristics of other elements. */
export const TextInput = (props: TextInputProps): JSX.Element => <RootTextInput {...props} size="sm" />;
