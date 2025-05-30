import Image from "next/image";
import { Image as ImageType } from "@/types/image";

function HomeImg({ heroImages }: { heroImages: ImageType[] }) {
  if (heroImages.length < 2) return null;

  return (
    <div className="w-full h-full flex gap-1">
      <div className="w-2/3">
        <Image src={heroImages[0].url} alt={heroImages[0].alt} width={500} height={800} className="h-full w-full object-cover" priority />
      </div>
      <div className="h-2/3 w-1/3">
        <Image priority src={heroImages[1].url} alt={heroImages[1].alt} width={500} height={800} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

export default HomeImg;
