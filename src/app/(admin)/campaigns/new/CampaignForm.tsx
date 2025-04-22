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
import { logError, logInfo, convertForPreview } from "@/lib/utils";
import { addCampaignAction } from "@/actions/campaign";
import { uploadImageAction } from "@/actions/upload";
import { Image as ImageType } from "@/types/image";
import { useToast } from "@/hooks/use-toast";
import { Building2, Calendar, FileImage, ImageIcon, Instagram, Plus, Upload } from "lucide-react";

interface LocalImage {
  file: File;
  previewUrl: string;
  type: string;
}

export default function CampaignForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [localImages, setLocalImages] = useState<LocalImage[]>([]);

  const form = useForm<Omit<Campaign, "id">>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: defaultCreateCampaignSchema,
  });

  const createPreview = async (file: File): Promise<string> => {
    try {
      const processedFile = await convertForPreview(file);
      return URL.createObjectURL(processedFile);
    } catch (error) {
      logError("Error creating preview", error);
      return URL.createObjectURL(file);
    }
  };

  const addLocalImage = async (file: File, type: string) => {
    const previewUrl = await createPreview(file);
    setLocalImages((prev) => [...prev, { file, previewUrl, type }]);
    return previewUrl;
  };

  const handleLogoSelect = async (file: File) => {
    const previewUrl = await addLocalImage(file, "logo");
    form.setValue("brand.logo", {
      url: previewUrl,
      id: Date.now(),
      alt: "temp-" + file.name,
    });
  };

  const handleMainImageSelect = async (file: File) => {
    const previewUrl = await addLocalImage(file, "hero");
    form.setValue("image", {
      url: previewUrl,
      id: Date.now(),
      alt: "temp-" + file.name,
    });
  };

  const handleCarouselImageSelect = async (file: File) => {
    const previewUrl = await addLocalImage(file, "carousel");
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

  const cleanInstagramUsername = (username: string): string => {
    if (!username) return "";

    // Remove @ symbol if present
    username = username.replace(/^@/, "");

    // Remove instagram.com URL if present
    username = username.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, "");

    // Remove trailing slash if present
    username = username.replace(/\/$/, "");

    // Remove any query parameters or fragments
    username = username.split(/[?#]/)[0];

    // Check if username contains spaces or special characters
    if (/\s/.test(username) || !/^[\w.]+$/.test(username)) {
      return ""; // Invalid username format
    }

    return username;
  };

  const validateFieldsAndShowWarnings = (): boolean => {
    let isValid = true;
    const formData = form.getValues();

    // Brand name validation
    if (!formData.brand.name) {
      toast({
        title: "Campo requerido",
        description: "El nombre de la marca es obligatorio",
        variant: "warning",
      });
      isValid = false;
    }

    // Brand logo validation
    if (!formData.brand.logo || !formData.brand.logo.url) {
      toast({
        title: "Campo requerido",
        description: "El logo de la marca es obligatorio",
        variant: "warning",
      });
      isValid = false;
    }

    // Instagram link validation - now required
    if (!formData.brand.link) {
      toast({
        title: "Campo requerido",
        description: "El Instagram de la marca es obligatorio",
        variant: "warning",
      });
      isValid = false;
    } else if (formData.brand.link) {
      const cleanUsername = cleanInstagramUsername(formData.brand.link);
      if (!cleanUsername) {
        toast({
          title: "Formato inválido",
          description: "El nombre de usuario de Instagram no es válido. No debe contener espacios ni caracteres especiales.",
          variant: "warning",
        });
        isValid = false;
      }
    }

    // Main image validation
    if (!formData.image || !formData.image.url) {
      toast({
        title: "Campo requerido",
        description: "La imagen principal es obligatoria",
        variant: "warning",
      });
      isValid = false;
    }

    // Additional images validation
    if (!formData.images || formData.images.length === 0) {
      toast({
        title: "Campo requerido",
        description: "Tiene que haber al menos una imagen adicional",
        variant: "warning",
      });
      isValid = false;
    }

    // Description validation
    if (!formData.description || formData.description.trim() === "") {
      toast({
        title: "Campo requerido",
        description: "La descripción es obligatoria",
        variant: "warning",
      });
      isValid = false;
    }

    // Date validation
    if (!date) {
      toast({
        title: "Campo requerido",
        description: "La fecha es obligatoria",
        variant: "warning",
      });
      isValid = false;
    } else {
      // Check if date is valid
      const selectedDate = new Date(date);
      if (isNaN(selectedDate.getTime())) {
        toast({
          title: "Formato inválido",
          description: "La fecha ingresada no es válida",
          variant: "warning",
        });
        isValid = false;
      }

      // Check if date is in the past (optional validation)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast({
          title: "Advertencia",
          description: "La fecha seleccionada está en el pasado",
          variant: "warning",
        });
        // Not marking as invalid, just a warning
      }
    }

    return isValid;
  };

  const onSubmit = async (data: Omit<Campaign, "id">) => {
    try {
      setIsSubmitting(true);

      // Validate fields and show warnings
      if (!validateFieldsAndShowWarnings()) {
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Enviando...",
        description: "Guardando la información de la campaña.",
        variant: "warning",
      });

      // Clean Instagram username if provided
      const username = cleanInstagramUsername(data.brand.link);

      if (data.brand.link && !username) {
        toast({
          title: "Error de validación",
          description: "El formato del usuario de Instagram no es válido",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const uploadSuccess = await uploadAllImages();
      if (!uploadSuccess) {
        toast({
          title: "Error",
          description: "No se pudieron cargar una o más imágenes",
          variant: "destructive",
        });
        form.setError("root", { message: "No se pudieron cargar una o más imágenes" });
        setIsSubmitting(false);
        return;
      }

      const updatedData = form.getValues();
      await addCampaignAction({
        ...updatedData,
        brand: {
          ...updatedData.brand,
          link: username ? `https://www.instagram.com/${username}` : "",
        },
      });

      toast({
        title: "¡Éxito!",
        description: "La campaña ha sido creada exitosamente.",
        variant: "default",
      });

      router.push("/campaigns");
    } catch (error) {
      logError("Error creating campaign", error);

      toast({
        title: "Error",
        description: "Ocurrió un problema al crear la campaña.",
        variant: "destructive",
      });

      let errorMessage = "Error al crear la campaña";
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-4xl">
        <FormField
          control={form.control}
          name="brand.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Marca</FormLabel>
              <FormControl>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input placeholder="Ingrese el nombre de la marca" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand.logo"
          render={({}) => (
            <FormItem>
              <FormLabel>Logo de la Marca</FormLabel>
              <FormControl>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        await handleLogoSelect(file);
                      }
                    }}
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
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

        <FormField
          control={form.control}
          name="brand.link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram de la Marca</FormLabel>
              <FormControl>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="@username"
                    {...field}
                    className="pl-10"
                    onChange={(e) => {
                      // Store clean value without @ symbol
                      const cleanValue = e.target.value.replace(/^@/, "");
                      field.onChange(cleanValue);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <div className="relative">
                  <FileImage className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Textarea placeholder="Ingrese la descripción" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({}) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
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
                    className="pl-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({}) => (
            <FormItem>
              <FormLabel>Imagen Principal</FormLabel>
              <FormControl>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        await handleMainImageSelect(file);
                      }
                    }}
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
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

        <div className="space-y-4">
          <FormLabel>Imágenes Adicionales</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {form.watch("images").map((image: ImageType, index: number) => (
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

                    setLocalImages((prev) => prev.filter((img) => img.previewUrl !== image.url));

                    const currentImages = form.getValues("images");
                    form.setValue(
                      "images",
                      currentImages.filter((_, i) => i !== index)
                    );

                    if (image.alt.startsWith("temp-")) {
                      URL.revokeObjectURL(image.url);
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 011.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 010-1.414z"
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
              <Plus className="h-8 w-8" />
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
