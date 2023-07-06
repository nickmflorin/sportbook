import * as types from "./types";

export interface ColorClassNameParams {
  readonly form: types.ColorForm;
  readonly color: types.Color;
  readonly shade?: types.ColorShade;
}

const parseColor = (color: types.Color): [types.ColorName, types.ColorShade | null] => {
  if (color.includes(".")) {
    const name = types.ColorNames.validate(color.split(".")[0]);
    const shade = color.split(".")[1];
    if (!shade) {
      throw new Error(`The provided color '${color}' is invalid!`);
    }
    types.assertColorShade(shade);
    return [name, shade];
  }
  const name = types.ColorNames.validate(color);
  return [name, null];
};

export const getColorClassName = ({ form, color, shade }: ColorClassNameParams): string => {
  const [name, sh] = parseColor(color);
  if (shade) {
    // The provided shade should override the shade in the color string.
    return `${form}-${name}-${shade}`;
  } else if (sh) {
    return `${form}-${name}-${sh}`;
  }
  return `${form}-${name}`;
};
