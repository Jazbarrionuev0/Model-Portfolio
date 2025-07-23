import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CampaignsList } from "@/components/admin/campaigns/CampaignsList";
import { Campaign } from "@/types/campaign";
import { deleteCampaignAction } from "@/actions/campaign";
import { useToast } from "@/hooks/use-toast";

// Mock the dependencies
jest.mock("@/actions/campaign", () => ({
  deleteCampaignAction: jest.fn(),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("CampaignsList Component", () => {
  const mockToast = jest.fn();
  const mockCampaigns: Campaign[] = [
    {
      id: 1,
      brand: {
        name: "Test Brand 1",
        logo: {
          id: 1,
          url: "https://example.com/logo1.jpg",
          alt: "Brand 1 logo",
        },
        link: "testbrand1",
      },
      description: "Test campaign 1 description",
      image: {
        id: 2,
        url: "https://example.com/image1.jpg",
        alt: "Campaign 1 image",
      },
      images: [],
      date: new Date("2024-01-01"),
    },
    {
      id: 2,
      brand: {
        name: "Test Brand 2",
        logo: {
          id: 3,
          url: "https://example.com/logo2.jpg",
          alt: "Brand 2 logo",
        },
        link: "testbrand2",
      },
      description: "Test campaign 2 description",
      image: {
        id: 4,
        url: "https://example.com/image2.jpg",
        alt: "Campaign 2 image",
      },
      images: [],
      date: new Date("2024-01-02"),
    },
  ];

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
    jest.clearAllMocks();
  });

  it("should render campaigns list", () => {
    render(<CampaignsList initialCampaigns={mockCampaigns} />);

    expect(screen.getByText("Test Brand 1")).toBeInTheDocument();
    expect(screen.getByText("Test Brand 2")).toBeInTheDocument();
    expect(screen.getByText("Test campaign 1 description")).toBeInTheDocument();
    expect(screen.getByText("Test campaign 2 description")).toBeInTheDocument();
  });

  it("should display empty state when no campaigns", () => {
    render(<CampaignsList initialCampaigns={[]} />);

    expect(screen.getByText(/no campaigns available/i)).toBeInTheDocument();
  });

  it("should show create button", () => {
    render(<CampaignsList initialCampaigns={mockCampaigns} />);

    const createButton = screen.getByRole("button", { name: /create campaign/i });
    expect(createButton).toBeInTheDocument();
  });

  it("should show edit and delete buttons for each campaign", () => {
    render(<CampaignsList initialCampaigns={mockCampaigns} />);

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it("should call delete action when delete button is clicked", async () => {
    const user = userEvent.setup();
    (deleteCampaignAction as jest.Mock).mockResolvedValue(undefined);

    render(<CampaignsList initialCampaigns={mockCampaigns} />);

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteCampaignAction).toHaveBeenCalledWith(1);
    });
  });

  it("should show success toast after successful deletion", async () => {
    const user = userEvent.setup();
    (deleteCampaignAction as jest.Mock).mockResolvedValue(undefined);

    render(<CampaignsList initialCampaigns={mockCampaigns} />);

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Campaign deleted successfully",
      });
    });
  });

  it("should show error toast when deletion fails", async () => {
    const user = userEvent.setup();
    (deleteCampaignAction as jest.Mock).mockRejectedValue(new Error("Delete failed"));

    render(<CampaignsList initialCampaigns={mockCampaigns} />);

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    });
  });

  it("should display campaign images correctly", () => {
    render(<CampaignsList initialCampaigns={mockCampaigns} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(4); // 2 brand logos + 2 campaign images

    // Check alt texts
    expect(screen.getByAltText("Brand 1 logo")).toBeInTheDocument();
    expect(screen.getByAltText("Brand 2 logo")).toBeInTheDocument();
    expect(screen.getByAltText("Campaign 1 image")).toBeInTheDocument();
    expect(screen.getByAltText("Campaign 2 image")).toBeInTheDocument();
  });
});
