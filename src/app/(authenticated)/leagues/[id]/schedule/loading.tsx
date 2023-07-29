import { Loading as LoadingComponent } from "~/components/loading";

export default function Loading() {
  return <LoadingComponent overlay={true} loading={true} />;
}
