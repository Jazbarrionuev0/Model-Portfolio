"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCampaignSchema, defaultCreateCampaignSchema } from "@/schemas/campaign.schema";
import { Campaign } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { logError, logInfo } from "@/lib/utils";
import { addCampaignAction } from "@/actions/campaign";
import { uploadImageAction } from "@/actions/upload";

interface LocalImage {
  file: File;
  previewUrl: string;
  type: string;
}

export default function CampaignForm() {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [localImages, setLocalImages] = useState<LocalImage[]>([]);

  const form = useForm<Omit<Campaign, "id">>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: defaultCreateCampaignSchema,
  });

  const createPreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const addLocalImage = (file: File, type: string) => {
    const previewUrl = createPreview(file);
    setLocalImages((prev) => [...prev, { file, previewUrl, type }]);
    return previewUrl;
  };

  const handleLogoSelect = (file: File) => {
    const previewUrl = addLocalImage(file, "logo");
    form.setValue("brand.logo", {
      url: previewUrl,
      id: Date.now(),
      alt: "temp-" + file.name,
    });
  };

  const handleMainImageSelect = (file: File) => {
    const previewUrl = addLocalImage(file, "hero");
    form.setValue("image", {
      url: previewUrl,
      id: Date.now(),
      alt: "temp-" + file.name,
    });
  };

  const handleCarouselImageSelect = (file: File) => {
    const previewUrl = addLocalImage(file, "carousel");
    const currentImages = form.getValues("images");
    form.setValue("images", [
      ...currentImages,
      {
        url: previewUrl,
        id: Date.now(),
        alt: "temp-" + file.name,
      },
    ]);
  };

  const uploadAllImages = async () => {
    const uploadPromises = localImages.map(async (localImage) => {
      try {
        const uploadedImage = await uploadImageAction(localImage.file);
        return {
          local: localImage,
          uploaded: uploadedImage,
        };
      } catch (error) {
        logError(`Error uploading ${localImage.type} image`, error);
        return {
          local: localImage,
          uploaded: null,
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    for (const result of results) {
      if (!result.uploaded) continue;

      if (result.local.type === "logo") {
        form.setValue("brand.logo", result.uploaded);
      } else if (result.local.type === "hero") {
        form.setValue("image", result.uploaded);
      } else if (result.local.type === "carousel") {
        const currentImages = form.getValues("images");
        const updatedImages = currentImages.map((img) => (img.url === result.local.previewUrl ? result.uploaded : img));
        form.setValue("images", updatedImages);
      }
    }

    localImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));

    return results.every((r) => r.uploaded !== null);
  };

  const onSubmit = async (data: Omit<Campaign, "id">) => {
    try {
      setIsSubmitting(true);

      if (!data.brand.name) {
        logError("Validation error: Brand name is required", null);
        form.setError("brand.name", { message: "Brand name is required" });
        return;
      }

      if (!form.getValues("brand.logo")) {
        logError("Validation error: Brand logo is required", null);
        form.setError("brand.logo", { message: "Brand logo is required" });
        return;
      }

      if (!form.getValues("image")) {
        logError("Validation error: Main image is required", null);
        form.setError("image", { message: "Main image is required" });
        return;
      }

      const username = data.brand.link;
      if (username && !username.startsWith("https://www.instagram.com/")) {
        data.brand.link = "https://www.instagram.com/" + username;
      }

      const uploadSuccess = await uploadAllImages();
      if (!uploadSuccess) {
        form.setError("root", { message: "Failed to upload one or more images" });
        return;
      }

      await addCampaignAction(data);

      router.push("/campaigns");
    } catch (error) {
      logError("Error creating campaign", error);

      let errorMessage = "Error creating campaign";
      if (error instanceof Error) {
        errorMessage = error.message;

        logError("Form state at time of error", {
          formValues: form.getValues(),
          formErrors: form.formState.errors,
          isDirty: form.formState.isDirty,
          isSubmitting: form.formState.isSubmitting,
        });
      }

      form.setError("root", {
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleCarouselImageSelect(file);
      }
    };
    fileInput.click();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        {/* Brand name field - unchanged */}
        <FormField
          control={form.control}
          name="brand.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Marca</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el nombre de la marca" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Brand logo field - updated */}
        <FormField
          control={form.control}
          name="brand.logo"
          render={({}) => (
            <FormItem>
              <FormLabel>Logo de la Marca</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleLogoSelect(file);
                    }
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
              {form.watch("brand.logo.url") && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200">
                    <Image src={form.watch("brand.logo.url")} alt="Brand Logo" fill sizes="96px" className="object-cover rounded-lg" />
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />

        {/* Brand link field - unchanged */}
        <FormField
          control={form.control}
          name="brand.link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram de la Marca</FormLabel>
              <FormControl>
                <Input placeholder="@username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description field - unchanged */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Ingrese la descripción" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date field - unchanged */}
        <FormField
          control={form.control}
          name="date"
          render={({}) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={date ? date.toISOString().split("T")[0] : ""}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : new Date();
                    setDate(newDate);
                    if (newDate) {
                      logInfo("Date selected", { date: newDate.toISOString() });
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Main image field - updated */}
        <FormField
          control={form.control}
          name="image"
          render={({}) => (
            <FormItem>
              <FormLabel>Imagen Principal</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleMainImageSelect(file);
                    }
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
              {form.watch("image.url") && (
                <div className="mt-4 w-full">
                  <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                  <div className="relative w-full max-w-lg min-h-96 rounded-lg overflow-hidden border border-gray-200">
                    <Image src={form.watch("image.url")} alt="Preview" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />

        {/* Additional images section - updated */}
        <div className="space-y-4">
          <FormLabel>Imágenes Adicionales</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {form.watch("images").map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    logInfo("Removing additional image", { imageIndex: index, imageId: image.id });

                    // Remove from localImages if it's a local preview
                    setLocalImages((prev) => prev.filter((img) => img.previewUrl !== image.url));

                    // Remove from form state
                    const currentImages = form.getValues("images");
                    form.setValue(
                      "images",
                      currentImages.filter((_, i) => i !== index)
                    );

                    // Revoke object URL if it's a local preview
                    if (image.alt.startsWith("temp-")) {
                      URL.revokeObjectURL(image.url);
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
              onClick={handleAddImage}
              disabled={isSubmitting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {form.formState.errors.root && <div className="p-4 bg-red-50 text-red-600 rounded-md">{form.formState.errors.root.message}</div>}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isSubmitting}>
          {form.formState.isSubmitting ? "Creando..." : "Crear Campaña"}
        </Button>
      </form>
    </Form>
  );
}
