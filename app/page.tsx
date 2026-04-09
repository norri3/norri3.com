import { Header } from "@/components/header";
import { ConfettiButton } from "@/components/confetti-button";

export default function Home() {
  return (
    <>
      <Header />
      <main className="text-center pt-40 px-5 pb-24">
        <h1 className="text-5xl md:text-6xl font-bold mb-5">
          Welcome to norri3.com
        </h1>
        <p className="text-xl md:text-2xl mb-10 opacity-90">
          This site is now powered by Next.js!
        </p>
        <ConfettiButton />
      </main>
    </>
  );
}
