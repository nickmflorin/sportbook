import Head from "next/head";
import { UserButton, currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { logger } from "~/internal/logger";

const Main = () => (
  <main>
    <h1>Welcome to your new app</h1>
    <p>Sign up for an account to get started</p>
  </main>
);

// Footer component
const Footer = () => (
  <footer>
    Powered by{" "}
    <a href="https://clerk.dev" target="_blank" rel="noopener noreferrer">
      <img src="/clerk.svg" alt="Clerk.dev" />
    </a>
    +
    <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
      <img src="/nextjs.svg" alt="Next.js" />
    </a>
  </footer>
);

export default async function Home() {
  return (
    <div>
      <Main />
      <Footer />
    </div>
  );
}
