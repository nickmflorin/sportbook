import { AppLayout } from "~/components/layout/AppLayout";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
