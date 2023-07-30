import { Icon } from "~/components/icons/Icon";
import { AppLayout } from "~/components/layout/AppLayout";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout
      authenticated={true}
      sidebar={[
        { href: "/dashboard", icon: <Icon name="house-chimney" />, active: { leadingPath: "/dashboard" } },
        {
          href: "/leagues",
          icon: <Icon name="sitemap" />,
          active: [
            { leadingPath: "/leagues" },
            { leadingPath: "/leagues/:id" },
            { leadingPath: "/leagues/:id/standings" },
            { leadingPath: "/leagues/:id/players" },
            { leadingPath: "/leagues/:id/schedule" },
          ],
        },
        { href: "/teams", icon: <Icon name="people-group" />, active: { leadingPath: "/teams" } },
        { href: "/games", icon: <Icon name="table-tennis-paddle-ball" />, active: { leadingPath: "/games" } },
      ]}
    >
      {children}
    </AppLayout>
  );
}
