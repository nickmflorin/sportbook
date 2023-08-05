import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useReactHookForm, type UseFormProps as UseReactHookFormProps } from "react-hook-form";
import { type z } from "zod";

import { type FormInstance, type BaseFormValues } from "./types";

type UseFormProps<I extends BaseFormValues> = Omit<UseReactHookFormProps<I>, "resolver"> & {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  readonly schema: z.ZodSchema<I, any, I>;
};

export const useForm = <I extends BaseFormValues>({
  schema,
  ...options
}: Omit<UseFormProps<I>, "resolver">): FormInstance<I> =>
  useReactHookForm<I>({ ...options, resolver: zodResolver(schema) });
