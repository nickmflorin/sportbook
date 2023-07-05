/* eslint-disable-next-line import/order */
import "~/styles/globals/index.scss";
import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { AppConfig } from "~/components/config/AppConfig";
import { AppLayout } from "~/components/layout";
import { env } from "~/env.mjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sportbook",
  description: "Social & pickup sports league management.",
};

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout authenticated={true}>{children}</AppLayout>;
}
