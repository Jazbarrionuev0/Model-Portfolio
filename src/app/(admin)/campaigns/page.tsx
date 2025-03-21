import { getCampaignsAction } from "@/actions/campaign";
import CampaignsList from "@/components/admin/campaigns/CampaignsList";

export default async function CampaignsPage() {
  const campaigns = await getCampaignsAction();

  return <CampaignsList initialCampaigns={campaigns} />;
}
