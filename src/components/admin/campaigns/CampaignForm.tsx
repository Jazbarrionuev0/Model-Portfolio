"use client";

import { useState } from "react";
import { Campaign } from "@/types/campaign";
import { createCampaign, updateCampaign } from "@/app/actions/campaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CampaignFormProps {
  campaign?: Campaign;
  onSuccess?: () => void;
}

export function CampaignForm({ campaign, onSuccess }: CampaignFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    brand: {
      name: campaign?.brand.name || "",
      logo: campaign?.brand.logo || "",
      link: campaign?.brand.link || "",
    },
    description: campaign?.description || "",
    image: (campaign?.image?.url || "") as string,
    images: campaign?.images || [],
    date: campaign?.date ? new Date(campaign.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const campaignData = {
      ...formData,
      image: {
        url: formData.image as string,
        id: campaign?.image?.id || Date.now(),
        alt: formData.description,
      },
      date: new Date(formData.date),
    };

    try {
      if (campaign) {
        await updateCampaign(campaign.id, campaignData as Partial<Campaign>);
      } else {
        await createCampaign(campaignData as Omit<Campaign, "id">);
      }
      onSuccess?.();
    } catch (err) {
      setError("Failed to save campaign");
      console.error("Error saving campaign:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="brandName">Brand Name</Label>
          <Input
            id="brandName"
            value={formData.brand.name}
            onChange={(e) => setFormData({ ...formData, brand: { ...formData.brand, name: e.target.value } })}
            required
          />
        </div>

        <div>
          <Label htmlFor="brandLogo">Brand Logo URL</Label>
          <Input
            id="brandLogo"
            value={formData.brand.logo as string}
            onChange={(e) => setFormData({ ...formData, brand: { ...formData.brand, logo: e.target.value } })}
            required
          />
        </div>

        <div>
          <Label htmlFor="brandLink">Brand Link</Label>
          <Input
            id="brandLink"
            value={formData.brand.link}
            onChange={(e) => setFormData({ ...formData, brand: { ...formData.brand, link: e.target.value } })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Main Image URL</Label>
          <Input id="image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} required />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : campaign ? "Update Campaign" : "Create Campaign"}
      </Button>
    </form>
  );
}
