import { Campaigns } from "@/components/Campaigns";
import Contact from "@/components/screens/Contact";
import HomePage from "@/components/screens/Home";
import Photos from "@/components/screens/Photos";

export default async function Home() {
  return (
    <main>
      <HomePage />
      <Photos />
      <Campaigns />
      <Contact />
    </main>
  );
}
