export type Model = {
  readonly id: string;
};

export type ModelValue = Date | string | number | boolean | null;
export type ModelForm = Record<string, ModelValue>;

export type ModelBaseFields = {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdById: string;
  readonly updatedById: string;
};

export type ModelBaseField<M extends ModelForm> = keyof ModelBaseFields & keyof M;
export type ModelDynamicField<M extends ModelForm, F extends keyof M> = F & Exclude<keyof M, ModelBaseField<M>>;
export type ModelBase<M extends ModelForm> = { [key in ModelBaseField<M>]: M[key] };
