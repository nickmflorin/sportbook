import clsx, { type ClassArray, type ClassValue } from "clsx";

export type ComponentProps = Partial<{
  readonly className: ClassArray | ClassValue;
  readonly style: React.CSSProperties;
}>;
