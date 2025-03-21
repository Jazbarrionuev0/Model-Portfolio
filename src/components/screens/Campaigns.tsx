import { Campaign } from "@/types/campaign";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";

export function Campaigns({ campaigns }: { campaigns: Campaign[] }) {
  const hasNoCampaigns = campaigns.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="campaigns">
      <h2 className="text-3xl font-bold text-center mb-12">Featured Campaigns</h2>
      {hasNoCampaigns ? (
        <div className="text-center p-8 bg-yellow-50 rounded-lg">
          <p className="text-yellow-600">No campaigns available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-96 w-full">
                <Image
                  src={campaign.image.url}
                  alt={campaign.description}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <Image
                      src={campaign.brand.logo.url}
                      alt={campaign.brand.name}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white"
                    />
                    <span className="font-semibold">{campaign.brand.name}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{campaign.description}</h3>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/campaign/${campaign.id}`}
                      className="inline-flex items-center text-sm font-medium text-white hover:text-blue-200 transition-colors"
                    >
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <span className="text-sm text-gray-200">{format(new Date(campaign.date), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
