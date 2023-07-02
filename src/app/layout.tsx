import "~/styles/globals/index.scss";
import { Inter } from "next/font/google";
import Script from "next/script";

import { Header } from "~/components/layout";
import { AppConfig } from "~/components/config/AppConfig";

const inter = Inter({ subsets: ["latin"] });

const SCRIPTS: string[] = [
  "https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js",
  "https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js",
];

export const metadata = {
  title: "Sportbook",
  description: "Social & pickup sports league management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <AppConfig>
        <body className={inter.className}>
          <Header />
          <main>{children}</main>
        </body>
      </AppConfig>
      {SCRIPTS.map((script, i) => (
        <Script key={i} src={script} />
      ))}
    </html>
  );
}
