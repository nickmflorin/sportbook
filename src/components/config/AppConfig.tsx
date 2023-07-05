import { type ReactNode } from "react";

import { ClerkProvider } from "@clerk/nextjs";

// import { MantineProvider } from "./MantineProvider";
import { env } from "~/env.mjs";

export interface AppConfigProps {
  readonly children: ReactNode;
}

export const AppConfig = ({ children }: AppConfigProps): JSX.Element => (
  <ClerkProvider
    // signInUrl={env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
    // signUpUrl={env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
    // afterSignInUrl={env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
    // afterSignUpUrl={env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
    publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    // navigate={t => console.log({ t })}
  >
    {children}
  </ClerkProvider>
);
