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

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        const images = await getHeroImagesAction();
        setHeroImages(images);

        const carouselImages = await getCarouselImages();
        setCarouselImages(carouselImages);
      } catch (error) {
        console.error("Error loading images:", error);
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
        // Create FormData and append file
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        console.log("Uploading file:", formData.get("file")); // Log the file being uploaded

        const newImage = await uploadImage(file, type);
        if (type === "hero") {
          setHeroImages([...heroImages, newImage]);
        } else {
          setCarouselImages([...carouselImages, newImage]);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        if (error instanceof Response) {
          const errorText = await error.text(); // Log the error response text
          console.error("Server response:", errorText);
        } else if (error instanceof Error) {
          console.error("Error message:", error.message); // Log the error message
        } else {
          console.error("Unexpected error:", error); // Log unexpected errors
        }
      }
    }
  };

  const handleDelete = async (id: number, type: "hero" | "carousel") => {
    if (!confirm("Estas segura que queres eliminar esta imagen?")) return;

    try {
      setError(null);
      await deleteImage(id.toString());
      if (type === "hero") {
        setHeroImages(heroImages.filter((img) => img.id !== id));
      } else {
        setCarouselImages(carouselImages.filter((img) => img.id !== id));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setError(error instanceof Error ? error.message : "Error deleting image");
    }
  };

  const handleEdit = (image: ImageType) => {
    setEditingImage(image);
    setNewAlt(image.alt);
  };

  const handleSaveEdit = async () => {
    if (editingImage) {
      try {
        const updatedImage = await updateImageAlt(editingImage.id.toString(), newAlt);
        if (editingImage.type === "hero") {
          setHeroImages(heroImages.map((img) => (img.id === updatedImage.id ? updatedImage : img)));
        } else {
          setCarouselImages(carouselImages.map((img) => (img.id === updatedImage.id ? updatedImage : img)));
        }
        setEditingImage(null);
      } catch (error) {
        console.error("Error updating image:", error);
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
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Hero</h2>
          <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
            Agregar Imágen
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "hero")} />
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
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "carousel")} />
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

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Editar Texto Alt</h3>
            <input
              type="text"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter alt text"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingImage(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancelar
              </button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
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
