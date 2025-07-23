import { getCampaignsAction } from "@/actions/campaign";
import CampaignsList from "@/components/admin/campaigns/CampaignsList";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CampaignsPage() {
  const campaigns = await getCampaignsAction();

  return <CampaignsList initialCampaigns={campaigns} />;
}
