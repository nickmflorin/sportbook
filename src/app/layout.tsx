import { Inter } from "next/font/google";
import "~/styles/globals/index.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sportbook",
  description: "Social and pickup sports league management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
