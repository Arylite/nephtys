import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { LatestReleases } from "@/components/home/LatestReleases";
import { Categories } from "@/components/home/Categories";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LatestReleases />
        <Categories />
      </main>
      <Footer />
    </>
  );
}
