import { NotFoundView } from "~/components/feedback/views/NotFoundView";

export default function NotFound() {
  return <NotFoundView link={{ label: "All Leagues", href: "/leagues" }} />;
}
