export type Model = {
  readonly id: string;
};

export type ModelValue = Date | string | number | boolean | null;
export type ModelForm = Record<string, ModelValue>;
