"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Campaign } from "@/types/campaign";
import { deleteCampaignAction } from "@/actions/campaign";
import { PlusCircle, Edit, Trash2, ExternalLink, Calendar } from "lucide-react";

interface CampaignsListProps {
  initialCampaigns: Campaign[];
}

const CampaignsList = ({ initialCampaigns }: CampaignsListProps) => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    router.push("/campaigns/new");
  };

  const handleEdit = (campaign: Campaign) => {
    router.push(`/campaigns/${campaign.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      setError(null);
      await deleteCampaignAction(id);
      setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
    } catch (error) {
      console.error("Error deleting campaign:", error);
      setError(error instanceof Error ? error.message : "Error deleting campaign");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm flex items-center">
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Campañas</h2>
          <p className="text-gray-500">Gestiona todas tus campañas publicitarias</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <PlusCircle size={18} />
          <span>Crear Nueva</span>
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={36} className="text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">No hay campañas</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Aún no has creado ninguna campaña. Comienza creando tu primera campaña publicitaria.</p>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>Crear Primera Campaña</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative h-48 bg-gray-100">
                {campaign.image?.url ? (
                  <Image
                    src={campaign.image.url}
                    alt={campaign.brand.name}
                    width={500}
                    height={192}
                    priority
                    className="w-full h-48 object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  {campaign.brand.logo ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        priority
                        src={campaign.brand.logo.url}
                        alt={`${campaign.brand.name} logo`}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xs font-bold">{campaign.brand.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-800">{campaign.brand.name}</h3>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{campaign.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar size={16} className="mr-2" />
                  <span>
                    {new Date(campaign.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                  <a
                    href={campaign.brand.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <ExternalLink size={14} />
                    <span>Ver sitio web</span>
                  </a>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                      aria-label="Edit campaign"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                      aria-label="Delete campaign"
                    >
                      <Trash2 size={16} />
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

export default CampaignsList;
