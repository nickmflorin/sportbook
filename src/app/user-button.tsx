"use client";
import { SignedIn, UserButton as RootUserButton } from "@clerk/nextjs";
import styles from "~/styles/Home.module.scss";
import Link from "next/link";
import Head from "next/head";
import { APIRequest } from "./api-request";

export const UserButton = () => (
  <SignedIn>
    <RootUserButton afterSignOutUrl="/" />
  </SignedIn>
);
