"use client";
import { SignInButton as RootSignInButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";

export const SignInButton = () => (
  <SignedOut>
    <RootSignInButton />
  </SignedOut>
);
