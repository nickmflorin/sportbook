import { AppLayout } from "~/components/layout";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout authenticated={true}>{children}</AppLayout>;
}
