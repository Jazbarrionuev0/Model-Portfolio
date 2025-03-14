"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { lato } from "@/fonts/fonts";
import { fetchInstagramMedia, type InstagramMedia } from "@/lib/instagram";

interface InstagramPhotosProps {
  count?: number;
}

const InstagramPhotos: React.FC<InstagramPhotosProps> = ({ count = 9 }) => {
  const [photos, setPhotos] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const media = await fetchInstagramMedia(count);
        setPhotos(media);
      } catch (err) {
        setError("Failed to fetch Instagram photos");
        console.error("Error fetching Instagram photos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [count]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className={lato.className}>
      <h2 className="text-2xl font-semibold mb-4">Instagram Feed</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {photos.map((photo) => (
          <a key={photo.id} href={photo.permalink} target="_blank" rel="noopener noreferrer" className="relative aspect-square overflow-hidden group">
            <Image
              src={photo.media_url}
              alt={photo.caption || "Instagram photo"}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">View on Instagram</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default InstagramPhotos;
