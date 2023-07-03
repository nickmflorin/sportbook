import { AppLayout } from "~/components/layout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout authenticated={true}>{children}</AppLayout>;
}
