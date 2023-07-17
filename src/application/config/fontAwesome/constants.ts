/*
The type bindings related to icons in the application are all derived from the values defined in this file, and if they
are not properly updated when Icons are added or removed - the type definitions will not be valid.  In this case, the
application will not start - because the validation logic will throw an Error during the icon registration process.

(1) Adding an Icon: If the Icon is not added to the proper constants in this file, the TS bindings will not allow the
    application to compile because the Icon component will not recognize the provided name or prop as a valid
    specification of an Icon in the registered library.  Luckily, the validation logic will throw an Error before the
    application is allowed to start. To fix this, follow these steps:

    i. Import the icon from the correct @fortawesome package and include the imported icon in the
       `IconRegistry` array.

   ii. Add the string name of the icon being added to the `IconNames` array.

        ***
        It is possible that an icon with the same name will be imported multiple times, from different @fortawesome
        packages.  In this case, the name does not need to be re-added to the `IconNames` array (the array should be
        unique) - but step (iii) is still required. Cases where there are multiple icons imported with the same name
        should be obvious, because the JS icon object that is imported will be named the same and alias imports will
        have to be used:

        import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
        import { faArrowDown as faArrowDownRegular } from "@fortawesome/free-regular-svg-icons";
        ***

  iii. Depending on the @fortawesome package that the icon was imported from, add the constant string name from step
       (ii) to the `Icons` object under the appropriate code that is associated with the @fortawesome package the icon
       was imported from.  Note that this still needs to be done even if the name is already present for another code.

(2) Removing an Icon: If the Icon is removed from the global registry, (i.e. it is no longer imported and included in
    the `IconRegistry` array), the application will not start because an error will be thrown in the validation logic
    during the icon registration process. To fix this, follow these steps:

    i. Determine whether or not the icon name associated with the icon being removed is used for multiple imported
       icons.  If it is not, remove the icon name from the `IconNames` array - otherwise, proceed to step (ii).

   ii. Remove the icon name from the `Icons` object under the appropriate code that is associated with the icon being
       removed.
*/

import { enumeratedLiterals, type EnumeratedLiteralType } from "~/lib/util/literals";

export const IconPrefixes = enumeratedLiterals(["far", "fas"] as const);

/**
 * Represents a given code that FontAwesome uses to reference the form that a given Icon (identified by the name,
 * {@link IconName}) can be registered under.
 *
 * This type will typically take on values such as "far", "fab" or "fas".
 */
export type IconPrefix = EnumeratedLiteralType<typeof IconPrefixes>;

/**
 * An {@link IconCode} represents a more intuitive, human readable form of the FontAwesome prefix values.  For instance,
 * "far" corresponds to the "regular" FontAwesome library, so the code is "regular".
 */
export const IconCodes = enumeratedLiterals(["solid", "regular"] as const);

/**
 * Represents a more intuitive, human readable form of a FontAwesome prefix, {@link IconPrefix}. For instance, "far"
 * corresponds to the "regular" FontAwesome library, so the code is "regular".
 *
 * @see IconPrefix
 */
export type IconCode = EnumeratedLiteralType<typeof IconCodes>;

export const IconPrefixMap = {
  [IconCodes.REGULAR]: IconPrefixes.FAR,
  [IconCodes.SOLID]: IconPrefixes.FAS,
};

export const IconCodeMap = {
  far: IconCodes.REGULAR,
  fas: IconCodes.SOLID,
};

/* When an Icon is added to the registry, the name must be added to this array.  If the name already exists, it is
   because the Icon's name is associated with multiple prefixes and the name does not need to be re-added to this array
   a second time.  This array should be unique. */
export const IconNames = enumeratedLiterals([
  "arrow-down",
  "arrow-up",
  "circle-question",
  "circle-exclamation",
  "circle-check",
  "xmark",
  "chevron-down",
  "circle-notch",
  "caret-down",
  "caret-up",
  "circle-xmark",
  "circle-plus",
  "trash-can",
  "copy",
  "triangle-exclamation",
  "hockey-puck",
  "sitemap",
  "people-group",
  "medal",
  "circle-half-stroke",
  "people-arrows",
  "house-chimney",
  "table-tennis-paddle-ball",
  "pen-to-square",
  "ellipsis",
] as const);

/* When an Icon is added to the registry, the name must be added to the appropriate IconCode key in this object type. */
export const Icons = {
  [IconCodes.REGULAR]: [
    IconNames.CIRCLE_QUESTION,
    IconNames.COPY,
    IconNames.TRASH_CAN,
    IconNames.PEN_TO_SQUARE,
  ] as const,
  [IconCodes.SOLID]: [
    IconNames.ARROW_UP,
    IconNames.ARROW_DOWN,
    IconNames.CIRCLE_CHECK,
    IconNames.CIRCLE_EXCLAMATION,
    IconNames.XMARK,
    IconNames.CHEVRON_DOWN,
    IconNames.CIRCLE_NOTCH,
    IconNames.CARET_UP,
    IconNames.CARET_DOWN,
    IconNames.CIRCLE_XMARK,
    IconNames.CIRCLE_PLUS,
    IconNames.COPY,
    IconNames.TRIANGLE_EXCLAMATION,
    IconNames.HOCKEY_PUCK,
    IconNames.SITEMAP,
    IconNames.PEOPLE_GROUP,
    IconNames.PEOPLE_ARROWS,
    IconNames.CIRCLE_HALF_STROKE,
    IconNames.PEOPLE_ARROWS,
    IconNames.MEDAL,
    IconNames.HOUSE_CHIMNEY,
    IconNames.TABLE_TENNIS_PADDLE_BALL,
    IconNames.ELLIPSIS,
  ] as const,
} as const;
