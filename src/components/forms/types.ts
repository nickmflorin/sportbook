import { type UseFormReturnType } from "@mantine/form";
import { type _TransformValues, type LooseKeys, type GetInputProps } from "@mantine/form/lib/types";

export type DefaultFormValues = Record<string, unknown>;
export type BaseTransformer<V = DefaultFormValues> = _TransformValues<V>;
export type DefaultTransformer<V = DefaultFormValues> = (values: V) => V;

export type FieldKeys<V> = LooseKeys<V>;

export type FormInstance<V = DefaultFormValues, TV extends BaseTransformer<V> = DefaultTransformer<V>> = Omit<
  UseFormReturnType<V, TV>,
  "getInputProps"
> & {
  readonly getFieldError: <F extends FieldKeys<V>>(path: F) => ReturnType<GetInputProps<V>>["error"];
  /* TODO: Mantine's form types the error as "any" - which we cannot allow because we do not know how to handle it.
     We will have to incorporate some sort of type checking around the error, and allow string, string[] or other common
     forms.  Then, the Field component can properly display the error content. */
  readonly getInputProps: (...args: Parameters<GetInputProps<V>>) => Omit<ReturnType<GetInputProps<V>>, "error">;
};
