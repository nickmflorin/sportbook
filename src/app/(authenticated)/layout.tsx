import { AppLayout } from "~/components/layout/AppLayout";

export interface AuthenticatedLayoutParams {
  readonly children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutParams) {
  return (
    <AppLayout
      authenticated={true}
      sidebar={[
        { href: "/dashboard", icon: { name: "house-chimney" }, active: { leadingPath: "/dashboard" } },
        {
          href: "/leagues",
          icon: { name: "sitemap" },
          active: [
            { leadingPath: "/leagues" },
            { leadingPath: "/leagues/:id" },
            { leadingPath: "/leagues/:id/standings" },
            { leadingPath: "/leagues/:id/players" },
            { leadingPath: "/leagues/:id/schedule" },
          ],
        },
        { href: "/teams", icon: { name: "people-group" }, active: { leadingPath: "/teams" } },
        { href: "/games", icon: { name: "table-tennis-paddle-ball" }, active: { leadingPath: "/games" } },
      ]}
    >
      {children}
    </AppLayout>
  );
}
