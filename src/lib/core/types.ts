import { type ExtractValues } from "~/lib/util/types";

/**
 * A type that represents the string, lowercase name of a native HTML element (i.e. "div" or "p").
 */
export type HTMLElementName = keyof HTMLElementTagNameMap & keyof JSX.IntrinsicElements;

/**
 * A generic type that results in the {@link HTMLElement} type that is associated with the string
 * name, {@link HTMLElementName}, provided as the generic type argument {@link E}.
 *
 * @example
 * HTMLElement<"div"> // HTMLDivElement
 */
export type FindHTMLElement<E extends HTMLElementName> = HTMLElementTagNameMap[E];

/**
 * A generic type that results in the string tag name of the {@link HTMLElement}, provided as the
 * first generic type argument {@link E}.
 *
 * @example
 * HTMLElementTag<HTMLButtonElement> // "button"
 */
export type HTMLElementTag<E extends HTMLElement> = ExtractValues<{
  [key in keyof HTMLElementTagNameMap & keyof JSX.IntrinsicElements as HTMLElementTagNameMap[key] extends E
    ? key
    : never]: key;
}> &
  keyof JSX.IntrinsicElements;
