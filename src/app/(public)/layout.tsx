import { AppLayout } from "~/components/layout/AppLayout";
import "~/styles/globals/public/index.scss";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
