import "~/styles/globals/index.scss";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Inter } from "next/font/google";
import Image from "next/image";
import Script from "next/script";
import styles from "~/styles/Header.module.scss";
import Link from "next/link";
import { Logout } from "./logout";
import { UserButton } from "./user-button";
import { SigninButton } from "./SigninButton";

const inter = Inter({ subsets: ["latin"] });

async function getUser() {
  const { userId, sessionId } = auth();
  console.log({ userId, sessionId });
  if (!sessionId) {
    return true;
  }
  return false;
}

export const metadata = {
  title: "Clerk with App Router",
  description: "Power your Next.js application with Clerk ",
};

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.svg" width="32" height="32" alt="Logo" />
          <span className={styles.appName}>Your application</span>
        </Link>
      </div>
      <div className={styles.right}>
        <Logout />
        <UserButton />
        <SigninButton />
        {/* <SignedOut>
          <Link href="/sign-in">Sign in</Link>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn> */}
      </div>
    </header>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <ClerkProvider>
        <body className={inter.className}>
          <Header />
          <main>{children}</main>
        </body>
      </ClerkProvider>
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js" />
    </html>
  );
}
