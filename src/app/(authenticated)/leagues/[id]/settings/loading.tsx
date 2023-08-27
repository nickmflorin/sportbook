import { Loading as LoadingComponent } from "~/components/loading/Loading";

export default function Loading() {
  return <LoadingComponent overlay={true} loading={true} />;
}
