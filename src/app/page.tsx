import { Campaigns } from "@/components/screens/Campaigns";
import { getHeroImagesAction } from "../actions/hero";
import Contact from "@/components/screens/Contact";
import HomePage from "@/components/screens/Home";
import Photos from "@/components/screens/Photos";
import { getCampaignsAction } from "@/actions/campaign";
import { getCarouselImagesAction } from "@/actions/carousel";
import Brands from "@/components/admin/campaigns/Brands";

export default async function Home() {
  const campaigns = await getCampaignsAction();
  const heroImages = await getHeroImagesAction();
  const carouselImages = await getCarouselImagesAction();
  const brands = campaigns.map((campaign) => campaign.brand);

  return (
    <main>
      <HomePage images={heroImages} />
      <Brands brands={brands} />
      <Photos images={carouselImages} />
      <Campaigns campaigns={campaigns} />
      <Contact />
    </main>
  );
}
