export interface InstagramPhoto {
  id: string;
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

export interface InstagramPhotosProps {
  username?: string;
  count?: number;
}
