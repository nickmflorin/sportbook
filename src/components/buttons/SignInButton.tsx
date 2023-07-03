"use client";
import { SignInButton as RootSignInButton, SignedOut } from "@clerk/nextjs";

export const SignInButton = () => (
  <SignedOut>
    <RootSignInButton />
  </SignedOut>
);
