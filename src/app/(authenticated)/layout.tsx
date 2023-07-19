import { icons } from "~/lib/ui";
import { AppLayout } from "~/components/structural/layout";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout
      authenticated={true}
      sidebar={[
        { href: "/dashboard", icon: icons.IconNames.HOUSE_CHIMNEY, active: { leadingPath: "/dashboard" } },
        {
          href: "/leagues",
          icon: icons.IconNames.SITEMAP,
          active: [{ leadingPath: "/leagues" }, { leadingPath: "/leagues/:id" }],
        },
        { href: "/teams", icon: icons.IconNames.PEOPLE_GROUP, active: { leadingPath: "/teams" } },
        { href: "/games", icon: icons.IconNames.TABLE_TENNIS_PADDLE_BALL, active: { leadingPath: "/games" } },
      ]}
    >
      {children}
    </AppLayout>
  );
}
