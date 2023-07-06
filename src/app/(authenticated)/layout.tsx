import { AppLayout } from "~/components/layout";

export const metadata = {
  title: "Sportbook",
  description: "Social & pickup sports league management.",
};

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout authenticated={true}>{children}</AppLayout>;
}
