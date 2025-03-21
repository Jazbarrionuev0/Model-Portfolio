import { Campaigns } from "@/components/screens/Campaigns";
import { getHeroImagesAction } from "../actions/hero";
import Contact from "@/components/screens/Contact";
import HomePage from "@/components/screens/Home";
import Photos from "@/components/screens/Photos";
import { getCampaignsAction } from "@/actions/campaign";
import { getCarouselImagesAction } from "@/actions/carousel";

export default async function Home() {
  const campaigns = await getCampaignsAction();
  const heroImages = await getHeroImagesAction();
  const carouselImages = await getCarouselImagesAction();

  return (
    <main>
      <HomePage images={heroImages} />
      <Photos images={carouselImages} />
      <Campaigns campaigns={campaigns} />
      <Contact />
    </main>
  );
}
