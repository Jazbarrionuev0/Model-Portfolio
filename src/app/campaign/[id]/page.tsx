import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getCampaignAction } from "@/actions/campaign";

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaignAction(Number(id));

  if (!campaign) {
    notFound();
  }

  return (
    <main className="min-h-dvh">
      <div className="relative h-dvh">
        <div className="absolute inset-0 overflow-hidden">
          <Image src={campaign.image.url} alt={campaign.description} fill priority className="object-cover" style={{ transform: "scale(1.1)" }} />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-12 text-white">
          <div>
            <Link
              href="/#campaigns"
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Image src={campaign.brand.logo.url} alt={campaign.brand.name} width={64} height={64} className="rounded-full border-2 border-white" />
              <span className="text-2xl font-bold">{campaign.brand.name}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">{campaign.description}</h1>
            <p className="text-xl opacity-90">Lanzado el {format(new Date(campaign.date), "d 'de' MMMM 'de' yyyy")}</p>
          </div>
        </div>

        {/* Scroll indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div> */}
      </div>

      {/* Brand Information */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Acerca de la Marca</h2>
              {/* <p className="text-gray-700 text-lg mb-8">
                {campaign.brand.name} se dedica a crear productos excepcionales que destacan en el mercado actual. Su atención al detalle y compromiso
                con la calidad hacen que cada campaña sea única e impactante.
              </p> */}
              <a
                href={"https://instagram.com/" + campaign.brand.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-yellow-600 text-yellow-600 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-yellow-600 hover:text-white"
              >
                Visitar Sitio Web de la Marca
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image src={campaign.brand.logo.url} alt={campaign.brand.name} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Description */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <p className="text-gray-700 text-lg leading-relaxed">{campaign.description}</p>
          <div className="mt-12 inline-block px-8 py-6 bg-gray-100 rounded-xl shadow-lg border border-gray-300">
            <p className="text-xl font-semibold text-gray-800">Fecha de Lanzamiento</p>
            <p className="text-3xl font-bold text-yellow-600">{format(new Date(campaign.date), "d 'de' MMMM 'de' yyyy")}</p>
          </div>
        </div>
      </section>

      {/* Campaign Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-12 text-center">Galería</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaign.images.map((image, index) => (
              <div
                key={image.id}
                className={`relative rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${
                  index === 0 ? "md:col-span-2 aspect-video" : "aspect-square"
                }`}
              >
                <Image src={image.url} alt={image.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
