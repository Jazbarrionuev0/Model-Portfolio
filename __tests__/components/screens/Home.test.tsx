import { render, screen } from "@testing-library/react";
import Home from "@/components/screens/Home";
import { Profile } from "@/types/profile";
import { Image } from "@/types/image";

// Mock the components that are used within Home
jest.mock("@/components/hero/HomeImg", () => {
  return function MockHomeImg() {
    return <div data-testid="home-image">Home Image</div>;
  };
});

jest.mock("@/components/hero/PortfolioButton", () => {
  return function MockPortfolioButton() {
    return <button data-testid="portfolio-button">Portfolio Button</button>;
  };
});

jest.mock("@/components/hero/AdminButton", () => {
  return function MockAdminButton() {
    return <button data-testid="admin-button">Admin Button</button>;
  };
});

describe("Home Component", () => {
  const mockProfile: Profile = {
    name: "Test Model",
    description: "Test description",
    occupation: "Model",
    instagram: "@testmodel",
    email: "test@example.com",
  };

  const mockImages: Image[] = [
    { id: 1, url: "test1.jpg", alt: "Test image 1" },
    { id: 2, url: "test2.jpg", alt: "Test image 2" },
    { id: 3, url: "test3.jpg", alt: "Test image 3" },
  ];

  it("renders home component successfully", () => {
    render(<Home profile={mockProfile} images={mockImages} />);

    // Check that the main container exists
    const homeContainer = screen.getByRole("main");
    expect(homeContainer).toBeInTheDocument();
  });

  it("renders HomeImg component", () => {
    render(<Home profile={mockProfile} images={mockImages} />);

    const homeImage = screen.getByTestId("home-image");
    expect(homeImage).toBeInTheDocument();
  });

  it("renders PortfolioButton component", () => {
    render(<Home profile={mockProfile} images={mockImages} />);

    const portfolioButton = screen.getByTestId("portfolio-button");
    expect(portfolioButton).toBeInTheDocument();
  });

  it("renders AdminButton component", () => {
    render(<Home profile={mockProfile} images={mockImages} />);

    const adminButton = screen.getByTestId("admin-button");
    expect(adminButton).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    render(<Home profile={mockProfile} images={mockImages} />);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    // Check that buttons are properly accessible
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2); // Portfolio and Admin buttons
  });

  it("displays profile information", () => {
    render(<Home profile={mockProfile} images={mockImages} />);

    // Check if profile name is displayed
    expect(screen.getByText(mockProfile.name)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.occupation)).toBeInTheDocument();
  });

  it("handles empty images array", () => {
    render(<Home profile={mockProfile} images={[]} />);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });

  it("handles single image", () => {
    const singleImage = [mockImages[0]];
    render(<Home profile={mockProfile} images={singleImage} />);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
