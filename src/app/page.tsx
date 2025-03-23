import { Campaigns } from "@/components/screens/Campaigns";
import { getHeroImagesAction } from "../actions/hero";
import Contact from "@/components/screens/Contact";
import Photos from "@/components/screens/Photos";
import { getCampaignsAction } from "@/actions/campaign";
import { getCarouselImagesAction } from "@/actions/carousel";
import HeroSection from "@/components/screens/Home";
import { Profile } from "@/types/profile";

export default async function Home() {
  const campaigns = await getCampaignsAction();
  const heroImages = await getHeroImagesAction();
  const carouselImages = await getCarouselImagesAction();

  const profile: Profile = {
    name: "Catalina Barrionuevo",
    email: "catalinabarrionuevo@gmail.com",
    description: "Modelo profesional especializada en campañas publicitarias y medios digitales. Enfocada en la creación de contenido de alta calidad.",
    instagram: "catabarrionuevo",
    occupation: "Modelo | Influencer",
  };

  return (
    <main>
      <HeroSection profile={profile} images={heroImages} />
      <Photos images={carouselImages} />
      <Campaigns campaigns={campaigns} />
      <Contact />
    </main>
  );
}
