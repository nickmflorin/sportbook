import Head from "next/head";

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

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
      <Main />
      <Footer />
    </div>
  );
}
