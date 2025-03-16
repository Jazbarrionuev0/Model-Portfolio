"use client";
import { useEffect, useState } from "react";
import { Image as ImageType } from "@/types/image";
import { getHeroImagesAction } from "@/app/actions/hero";
import Image from "next/image";
import { getCarouselImages } from "@/app/actions/carousel";
import { uploadImage, deleteImage, updateImageAlt } from "@/app/actions/image";

const Page = () => {
  const [heroImages, setHeroImages] = useState<ImageType[]>([]);
  const [carouselImages, setCarouselImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<ImageType | null>(null);
  const [newAlt, setNewAlt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ status: 'idle' | 'uploading' | 'success' | 'error', message?: string }>({ status: 'idle' });

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        console.log("[CLIENT] Loading hero images");
        const images = await getHeroImagesAction();
        setHeroImages(images);
        console.log("[CLIENT] Hero images loaded:", images.length);

        console.log("[CLIENT] Loading carousel images");
        const carouselImages = await getCarouselImages();
        setCarouselImages(carouselImages);
        console.log("[CLIENT] Carousel images loaded:", carouselImages.length);
      } catch (error) {
        console.error("[CLIENT_ERROR] Error loading images:", error);
        setError("Failed to load images. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };
    loadImages();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "hero" | "carousel") => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadStatus({ status: 'uploading', message: `Uploading ${file.name}...` });
        console.log(`[CLIENT] Starting upload of ${type} image:`, {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          lastModified: new Date(file.lastModified).toISOString()
        });

        // Reset the error state
        setError(null);

        console.log("[CLIENT] Calling uploadImage action");
        const newImage = await uploadImage(file, type);
        console.log("[CLIENT] Upload successful:", newImage);

        if (type === "hero") {
          setHeroImages([...heroImages, newImage]);
        } else {
          setCarouselImages([...carouselImages, newImage]);
        }
        
        setUploadStatus({ status: 'success', message: 'Upload successful!' });
        
        // Reset the file input
        e.target.value = '';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUploadStatus({ status: 'idle' });
        }, 3000);
      } catch (error) {
        console.error("[CLIENT_ERROR] Error uploading image:", error);
        
        let errorMessage = "Failed to upload image. Please try again.";
        
        // Detailed error logging
        if (error instanceof Response) {
          try {
            const errorText = await error.text();
            console.error("[CLIENT_ERROR] Server response:", errorText);
            errorMessage = `Server error: ${error.status} ${error.statusText}. Details: ${errorText}`;
          } catch (textError) {
            console.error("[CLIENT_ERROR] Failed to read error response text:", textError);
          }
        } else if (error instanceof Error) {
          console.error("[CLIENT_ERROR] Error message:", error.message);
          console.error("[CLIENT_ERROR] Error stack:", error.stack);
          errorMessage = `Error: ${error.message}`;
        } else {
          console.error("[CLIENT_ERROR] Unexpected error type:", typeof error);
          console.error("[CLIENT_ERROR] Stringified error:", JSON.stringify(error));
        }
        
        setError(errorMessage);
        setUploadStatus({ status: 'error', message: errorMessage });
        
        // Reset the file input
        e.target.value = '';
      }
    }
  };

  const handleDelete = async (id: number, type: "hero" | "carousel") => {
    if (!confirm("Estas segura que queres eliminar esta imagen?")) return;

    try {
      setError(null);
      console.log(`[CLIENT] Deleting ${type} image with ID:`, id);
      await deleteImage(id.toString());
      console.log(`[CLIENT] Successfully deleted image with ID:`, id);
      
      if (type === "hero") {
        setHeroImages(heroImages.filter((img) => img.id !== id));
      } else {
        setCarouselImages(carouselImages.filter((img) => img.id !== id));
      }
    } catch (error) {
      console.error("[CLIENT_ERROR] Error deleting image:", error);
      let errorMessage = "Error deleting image";
      
      if (error instanceof Error) {
        console.error("[CLIENT_ERROR] Error message:", error.message);
        console.error("[CLIENT_ERROR] Error stack:", error.stack);
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleEdit = (image: ImageType) => {
    setEditingImage(image);
    setNewAlt(image.alt);
  };

  const handleSaveEdit = async () => {
    if (editingImage) {
      try {
        console.log(`[CLIENT] Updating alt text for image ID:`, editingImage.id);
        const updatedImage = await updateImageAlt(editingImage.id.toString(), newAlt);
        console.log(`[CLIENT] Successfully updated alt text:`, updatedImage);
        
        if (editingImage.type === "hero") {
          setHeroImages(heroImages.map((img) => (img.id === updatedImage.id ? updatedImage : img)));
        } else {
          setCarouselImages(carouselImages.map((img) => (img.id === updatedImage.id ? updatedImage : img)));
        }
        setEditingImage(null);
      } catch (error) {
        console.error("[CLIENT_ERROR] Error updating image:", error);
        let errorMessage = "Error updating image";
        
        if (error instanceof Error) {
          console.error("[CLIENT_ERROR] Error message:", error.message);
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
      
      {uploadStatus.status === 'uploading' && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
          {uploadStatus.message}
        </div>
      )}
      
      {uploadStatus.status === 'success' && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {uploadStatus.message}
        </div>
      )}
      
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Hero</h2>
          <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
            Agregar Imágen
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleFileUpload(e, "hero")} 
              disabled={uploadStatus.status === 'uploading'}
            />
          </label>
        </div>
        {heroImages.length === 0 ? (
          <p className="text-gray-500">No hay imágenes hero</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroImages.map((img) => (
              <div
                key={img.id}
                className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-[300px]"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">{img.alt}</span>
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => handleEdit(img)} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(img.id, "hero")}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    disabled={heroImages.length <= 2}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Carousel</h2>
          <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
            Agregar Imágen
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleFileUpload(e, "carousel")} 
              disabled={uploadStatus.status === 'uploading'}
            />
          </label>
        </div>
        {carouselImages.length === 0 ? (
          <p className="text-gray-500">No hay imágenes de carousel</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carouselImages.map((img) => (
              <div
                key={img.id}
                className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-[300px]"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">{img.alt}</span>
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => handleEdit(img)} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(img.id, "carousel")}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Editar Alt Text</h3>
            <input
              type="text"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Alt text"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingImage(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
