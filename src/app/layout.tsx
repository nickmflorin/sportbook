import "~/styles/globals/index.scss";
import { Inter } from "next/font/google";

import { AppConfig } from "~/components/config/AppConfig";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sportbook",
  description: "Social & pickup sports league management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppConfig>
      <html lang="en">
        <head></head>
        <body className={inter.className}>{children}</body>
      </html>
    </AppConfig>
  );
}
