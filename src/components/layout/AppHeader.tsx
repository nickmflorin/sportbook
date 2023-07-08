import Link from "next/link";

import { SignInButton } from "~/components/buttons/SignInButton";
import { UserButton } from "~/components/buttons/UserButton";
import { env } from "~/env.mjs";

const AppHeaderLogo = () => {
  return (
    <Link href="/" className="app-header__logo">
      {env.APP_NAME_FORMAL}
    </Link>
  );
};

export const AppHeader = (): JSX.Element => (
  <header className="app-header">
    <div className="app-header__left">
      <AppHeaderLogo />
    </div>
    <div className="app-header__right">
      <UserButton />
      <SignInButton />
    </div>
  </header>
);
