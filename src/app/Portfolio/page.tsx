import { ImagePopUp } from "@/components/ImagePopUp";
import Images from "@/components/Images";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <main className="">
      <NavBar />
      <div className="flex justify-evenly flex-wrap">
        <ImagePopUp
          src="/cati.jpg?height=500&width=800"
          alt="Imagen de ejemplo"
          width={500}
          height={800}
        />
        <ImagePopUp
          src="/cati.jpg?height=300&width=400"
          alt="Imagen de ejemplo"
          width={500}
          height={800}
        />    <ImagePopUp
          src="/cati.jpg?height=300&width=400"
          alt="Imagen de ejemplo"
          width={500}
          height={800}
        />    <ImagePopUp
          src="/cati.jpg?height=300&width=400"
          alt="Imagen de ejemplo"
          width={500}
          height={800}
        />    <ImagePopUp
          src="/cati.jpg?height=300&width=400"
          alt="Imagen de ejemplo"
          width={500}
          height={800}
        />
        <ImagePopUp
          src="/cati.jpg?height=300&width=400"
          alt="Imagen de ejemplo"
          width={500}
          height={800}
        />
      </div>

    </main>
  );
}
