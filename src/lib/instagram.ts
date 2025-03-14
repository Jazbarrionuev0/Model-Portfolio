export interface InstagramMedia {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

export interface InstagramResponse {
  data: InstagramMedia[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next: string;
  };
}

export async function fetchInstagramMedia(count: number = 9): Promise<InstagramMedia[]> {
  const token = process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN;

  if (!token) {
    throw new Error("Instagram token not found in environment variables");
  }

  const fields = "id,media_type,media_url,permalink,caption,timestamp,thumbnail_url";
  const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}&limit=${count}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }

    const data: InstagramResponse = await response.json();
    return data.data.filter(
      (media) =>
        // Only return images and first image of carousel albums
        media.media_type === "IMAGE" || media.media_type === "CAROUSEL_ALBUM"
    );
  } catch (error) {
    console.error("Error fetching Instagram media:", error);
    throw error;
  }
}
