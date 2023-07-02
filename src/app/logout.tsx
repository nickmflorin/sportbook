"use client";
import { SignOutButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";

export const Logout = () => (
  <SignedIn>
    <SignOutButton />
  </SignedIn>
);
