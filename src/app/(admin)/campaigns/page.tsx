"use client";
import { useEffect, useState } from "react";
import { getCampaigns, deleteCampaign } from "@/app/actions/campaign";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Campaign } from "@/types/campaign";

const CampaignsPage = () => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Error loading campaigns:", error);
      setError("Error loading campaigns");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    router.push("/campaigns/new");
  };

  const handleEdit = (campaign: Campaign) => {
    router.push(`/campaigns/${campaign.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      setError(null);
      await deleteCampaign(id);
      setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
    } catch (error) {
      console.error("Error deleting campaign:", error);
      setError(error instanceof Error ? error.message : "Error deleting campaign");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Campañas</h2>
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Crear Nueva
        </button>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-gray-500">No hay campañas</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                <Image src={campaign.image.url} alt={campaign.brand.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{campaign.brand.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Fecha: {new Date(campaign.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <a href={campaign.brand.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 text-sm">
                    Ver sitio web
                  </a>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
