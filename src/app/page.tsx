import { Campaigns } from "@/components/screens/Campaigns";
import { getHeroImagesAction } from "../actions/hero";
import Contact from "@/components/screens/Contact";
import Photos from "@/components/screens/Photos";
import { getCampaignsAction } from "@/actions/campaign";
import { getCarouselImagesAction } from "@/actions/carousel";
import HeroSection from "@/components/screens/Home";
import { getProfileAction } from "@/actions/profile";

// Force dynamic rendering for fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const campaigns = await getCampaignsAction();
  const heroImages = await getHeroImagesAction();
  const carouselImages = await getCarouselImagesAction();
  const profile = await getProfileAction();

  return (
    <main>
      <HeroSection profile={profile} images={heroImages} />
      <Photos images={carouselImages} />
      <Campaigns campaigns={campaigns} />
      <Contact profile={profile} />
    </main>
  );
}
