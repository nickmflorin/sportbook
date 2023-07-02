import Link from "next/link";
import { env } from "~/env.mjs";

import { UserButton } from "~/components/buttons/UserButton";
import { SignInButton } from "~/components/buttons/SignInButton";

const HeaderLogo = () => {
  return (
    <Link href="/" className="app-header__logo">
      {env.APP_NAME_FORMAL}
    </Link>
  );
};

export interface HeaderProps {}

export const Header = (props: HeaderProps): JSX.Element => (
  <header className="app-header">
    <div className="app-header__left">
      <HeaderLogo />
    </div>
    <div className="app-header__right">
      <UserButton />
      <SignInButton />
    </div>
  </header>
);
