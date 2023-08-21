export type DrawerRenderer<P = []> = (...args: P[]) => Promise<JSX.Element | null>;
