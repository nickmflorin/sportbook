import { createContext } from "react";

import { type DrawerId } from "~/components/drawers";

export const DrawerContext = createContext<DrawerId | null>(null);
