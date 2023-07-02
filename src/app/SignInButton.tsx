"use client";
import { SignInButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";

export const SigninButton = () => (
  <SignedOut>
    <SignInButton />
  </SignedOut>
);
