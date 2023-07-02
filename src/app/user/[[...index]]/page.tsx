import { UserProfile } from "@clerk/nextjs";
import styles from "~/styles/User.module.scss";

export default function Page() {
  return (
    <div className={styles.user}>
      <UserProfile />
    </div>
  );
}
