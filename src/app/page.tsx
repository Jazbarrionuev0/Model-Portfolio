import AboutMe from "@/components/screens/AboutMe";
import Contact from "@/components/screens/Contact";
import GoToPortfolio from "@/components/screens/GoToPortfolio";
import HomePage from "@/components/screens/Home";
import Photos from "@/components/screens/Photos";


export default function Home() {
  return (
    <main className="">
      <HomePage />
      <Photos />
      <AboutMe />
      <GoToPortfolio />
      <Contact />

    </main>
  );
}
