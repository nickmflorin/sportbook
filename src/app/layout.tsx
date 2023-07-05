import { Inter } from "next/font/google";
import { type ReactNode } from "react";

/* eslint-disable-next-line import/order */
import "~/styles/globals/index.scss";
/* eslint-disable-next-line import/order */
import { AppConfig } from "~/components/config/AppConfig";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sportbook",
  description: "Social & pickup sports league management.",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <AppConfig>
      <body className={inter.className}>{children}</body>
    </AppConfig>
  </html>
);

export default RootLayout;
