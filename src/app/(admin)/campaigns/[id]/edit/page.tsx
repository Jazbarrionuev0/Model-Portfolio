import { getCampaignAction } from "@/actions/campaign";
import EditCampaignForm from "./EditCampaignForm";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaignAction(Number(id));

  if (!campaign) {
    return <div>not found</div>;
  }

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen p-8">
      <EditCampaignForm campaign={campaign} />
    </div>
  );
}
