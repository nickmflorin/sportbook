import { Inter } from "next/font/google";
import { type ReactNode } from "react";

/* eslint-disable-next-line import/order */
import "~/styles/globals/index.scss";
/* eslint-disable-next-line import/order */
import { configureServerApplication } from "~/application/config/server";
/* eslint-disable-next-line import/order */
import { AppConfig } from "~/components/config/AppConfig";

configureServerApplication();

const InterFont = Inter({
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sportbook",
  description: "Social & pickup sports league management.",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body className={InterFont.className}>
      <AppConfig>{children}</AppConfig>
    </body>
  </html>
);

export default RootLayout;
