import React from "react";

import classNames from "classnames";

import { MultiMenu } from "./multi";
import { type MenuProps } from "./props";

export const Menu = <V extends string | null, M>({ style, className, ...props }: MenuProps<V, M>): JSX.Element => (
  <div style={style} className={classNames("menu", className)}>
    <div className="menu__items-container">{props.mode === "multiple" ? <MultiMenu {...props} /> : <></>}</div>
  </div>
);

// const ValuedSingleMenu = <V extends string | null, M extends Record<string, unknown>>({
//   value,
//   onChange,
//   items,
//   defaultValue,
//   clearable,
//   getValue,
//   ...props
// }: ValuedSingleMenuProps<V, M>): JSX.Element => {
//   if (uniq(items.map(i => i.value)).length !== items.length) {
//     throw new Error("");
//   }
//   /* TODO: Validate that if the menu is nullable, the default value is null - otherwise it is not nullable?
//      if ((value === null || default === null)) */

/*   if (value !== undefined && value === null && defaultValue === undefined) {
       throw new Error("");
     } */

//   const [_value, setValue] = useState<Exclude<V, null> | V>(defaultValue === undefined ? (null as V) : defaultValue);

/*   const onMenuItemClick = useMemo(
       () => (item: ValuedMenuItem<V, M>) => {
         setValue(item.value);
         onChange?.(item.value, item.datum);
       },
       [onChange],
     ); */

/*   return (
       <div {...props} className={classNames("menu", props.className)}>
         <div className="menu__items-container">
           {items.map((item, i) => (
             <ValuedMenuItem
               key={i}
               {...item}
               onClick={() => onMenuItemClick(item)}
               selected={(value === undefined ? _value : value) === item.value}
             />
           ))}
         </div>
       </div>
     );
   }; */
