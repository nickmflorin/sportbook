import { AppLayout } from "~/components/layout";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout authenticated={false}>{children}</AppLayout>;
}
