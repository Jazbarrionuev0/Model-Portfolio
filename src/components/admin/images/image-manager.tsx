"use client";
import { useState } from "react";
import { Image as ImageType } from "@/types/image";
import Image from "next/image";
import { addHeroImageAction, deleteHeroImageAction } from "@/actions/hero";
import { uploadImageAction } from "@/actions/upload";
import { addCarouselImageAction, deleteCarouselImageAction } from "@/actions/carousel";
import { logError, convertForPreview } from "@/lib/utils";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ImageTypeKey = "hero" | "carousel";

interface ImageManagerProps {
  images: ImageType[];
  type: ImageTypeKey;
  title: string;
  emptyMessage: string;
  minImages?: number;
}

const ImageManager = ({ images: initialImages, type, title, emptyMessage, minImages = 0 }: ImageManagerProps) => {
  const [images, setImages] = useState<ImageType[]>(initialImages);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ status: "idle" | "uploading" | "success" | "error"; message?: string }>({ status: "idle" });
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadStatus({ status: "uploading", message: `Subiendo ${file.name}...` });
        setError(null);

        // Show loading toast
        toast({
          title: "Subiendo imagen...",
          description: `Procesando ${file.name}`,
        });

        // Convert HEIC/HEIF files to JPEG for preview if needed
        const processedFile = (await convertForPreview(file)) as File;

        const newImage = await uploadImageAction(processedFile);

        if (type === "hero") {
          await addHeroImageAction(newImage);
        } else if (type === "carousel") {
          await addCarouselImageAction(newImage);
        }

        setImages([...images, newImage]);
        setUploadStatus({ status: "success", message: "Upload successful!" });

        // Show success toast
        toast({
          title: "¡Imagen subida!",
          description: `${file.name} se ha subido correctamente.`,
          variant: "default",
        });

        e.target.value = "";

        setTimeout(() => {
          setUploadStatus({ status: "idle" });
        }, 3000);
      } catch (error) {
        let errorMessage = "Error al subir la imagen. Inténtalo de nuevo.";

        if (error instanceof Response) {
          try {
            const errorText = await error.text();
            console.error("[CLIENT_ERROR] Server response:", errorText);
            errorMessage = `Error del servidor: ${error.status} ${error.statusText}`;
          } catch (textError) {
            console.error("[CLIENT_ERROR] Failed to read error response text:", textError);
          }
        } else if (error instanceof Error) {
          console.error("[CLIENT_ERROR] Error message:", error.message);
          console.error("[CLIENT_ERROR] Error stack:", error.stack);
          errorMessage = error.message.includes("size") ? "La imagen es demasiado grande. Máximo 5MB." : `Error: ${error.message}`;
        } else {
          console.error("[CLIENT_ERROR] Unexpected error type:", typeof error);
          console.error("[CLIENT_ERROR] Stringified error:", JSON.stringify(error));
        }

        setError(errorMessage);
        setUploadStatus({ status: "error", message: errorMessage });

        // Show error toast
        toast({
          title: "Error al subir imagen",
          description: errorMessage,
          variant: "destructive",
        });

        e.target.value = "";
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás segura que quieres eliminar esta imagen?")) return;

    try {
      setError(null);

      // Show loading toast for delete action
      toast({
        title: "Eliminando imagen...",
        description: "Procesando solicitud...",
      });

      if (type === "hero") {
        await deleteHeroImageAction(id);
      } else if (type === "carousel") {
        await deleteCarouselImageAction(id);
      }

      setImages(images.filter((img) => img.id !== id));

      // Show success toast on delete
      toast({
        title: "Imagen eliminada",
        description: "La imagen se ha eliminado correctamente.",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = "Error al eliminar la imagen. Inténtalo de nuevo.";
      logError(errorMessage, error);

      setError(errorMessage);

      // Show error toast
      toast({
        title: "Error al eliminar",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-12">
      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <label
          className={`
          ${uploadStatus.status === "uploading" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"} 
          text-white px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 
          ${uploadStatus.status === "uploading" ? "" : "hover:shadow-md transform hover:scale-105"}
          min-w-fit
        `}
        >
          {uploadStatus.status === "uploading" ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span className="hidden sm:inline">Subiendo...</span>
              <span className="sm:hidden">Subiendo</span>
            </>
          ) : (
            <>
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Agregar Imagen</span>
              <span className="sm:hidden">Agregar</span>
            </>
          )}
          <input
            type="file"
            accept="image/*,image/heic,image/heif"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploadStatus.status === "uploading"}
          />
        </label>
      </div>
      {images.length === 0 ? (
        <p className="text-gray-500">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group overflow-hidden rounded-md shadow-md hover:shadow-xl transition-shadow duration-300"
              style={{ aspectRatio: "3/4", minHeight: "300px" }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                {/* <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">{img.alt}</span> */}
              </div>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="bg-red-500/90 text-white p-2 rounded-full hover:bg-red-600 
                    transition-all duration-200 transform hover:scale-105 
                    flex items-center justify-center
                    shadow-md hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    w-8 h-8"
                  disabled={images.length <= minImages}
                  title="Delete image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageManager;
