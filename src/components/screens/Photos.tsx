import { CarouselImg } from "./CarouselImg";
import { Image } from "@/types/image";

function Photos({ images }: { images: Image[] }) {
  return (
    <section className="min-h-screen flex justify-center items-center bg-black text-white overflow-x-hidden">
      <CarouselImg images={images} />
    </section>
  );
}

export default Photos;
