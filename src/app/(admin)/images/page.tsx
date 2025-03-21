import { getCarouselImagesAction } from "@/actions/carousel";
import { getHeroImagesAction } from "@/actions/hero";
import Images from "@/components/admin/images/Images";
import { NextPage } from "next";

const Page: NextPage = async () => {
  const heroImages = await getHeroImagesAction();
  const carouselImages = await getCarouselImagesAction();

  return <Images heroImages={heroImages} carouselImages={carouselImages} />;
};

export default Page;
