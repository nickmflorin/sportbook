"use client";
import { SignedIn, UserButton as RootUserButton } from "@clerk/nextjs";

export const UserButton = () => (
  <SignedIn>
    <RootUserButton afterSignOutUrl="/" />
  </SignedIn>
);
