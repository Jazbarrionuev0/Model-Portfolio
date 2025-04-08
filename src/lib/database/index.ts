import { ImageRepository } from "./repositories/imageRepository";
import { CampaignRepository } from "./repositories/campaignRepository";
import { ProfileRepository } from "./repositories/profileRepository";
import { Image } from "@/types/image";
import { Campaign } from "@/types/campaign";
import { Profile } from "@/types/profile";

export const heroImagesRepository = new ImageRepository("hero");
export const carouselImagesRepository = new ImageRepository("carousel");
export const campaignsRepository = new CampaignRepository();
export const profileRepository = new ProfileRepository();

export const getHeroImages = () => heroImagesRepository.getImages();
export const addHeroImage = (image: Image) => heroImagesRepository.addImage(image);
export const deleteHeroImage = (id: number) => heroImagesRepository.deleteImage(id);

export const getCarouselImages = () => carouselImagesRepository.getImages();
export const addCarouselImage = (image: Image) => carouselImagesRepository.addImage(image);
export const deleteCarouselImage = (id: number) => carouselImagesRepository.deleteImage(id);

export const getCampaigns = () => campaignsRepository.getCampaigns();
export const getCampaign = (id: number) => campaignsRepository.getCampaign(id);
export const addCampaign = (campaign: Omit<Campaign, "id">) => campaignsRepository.addCampaign(campaign);
export const updateCampaign = (campaign: Campaign) => campaignsRepository.updateCampaign(campaign);
export const deleteCampaign = (id: number) => campaignsRepository.deleteCampaign(id);

export const getProfile = () => profileRepository.getProfile();
export const createProfile = (profile: Profile) => profileRepository.createProfile(profile);
export const updateProfile = (profile: Profile) => profileRepository.updateProfile(profile);
