import { Inter } from "next/font/google";
import Script from "next/script";
import { type ReactNode } from "react";

import { env } from "~/env.mjs";
/* eslint-disable-next-line import/order */
import "~/styles/globals/index.scss";
/* eslint-disable-next-line import/order */
import { AppConfig } from "~/components/config/AppConfig";

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
    <head>
      <Script
        type="text/javascript"
        src={`https://kit.fontawesome.com/${env.FONT_AWESOME_KIT_TOKEN}.js`}
        crossOrigin="anonymous"
        data-auto-replace-svg="nest"
        async
      />
    </head>
    <body className={InterFont.className}>
      <AppConfig>{children}</AppConfig>
    </body>
  </html>
);

export default RootLayout;
