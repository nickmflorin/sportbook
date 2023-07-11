import { AppLayout } from "~/components/structural/layout";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout authenticated={true}>{children}</AppLayout>;
}
