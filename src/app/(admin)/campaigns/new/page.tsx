"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCampaignSchema } from "@/schemas/campaign.schema";
import { createCampaign } from "@/app/actions/campaigns";
import { Campaign } from "@/types/campaign";
import { Image as ImageType } from "@/types/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

// Helper functions for consistent logging
function logInfo(message: string, data?: Record<string, unknown>): void {
  console.log(`[CAMPAIGN_FORM_INFO] ${message}`, data ? JSON.stringify(data) : "");
}

function logError(message: string, error: unknown): void {
  console.error(`[CAMPAIGN_FORM_ERROR] ${message}`, error);
  // Log additional error details if available
  if (error instanceof Error) {
    console.error(`[CAMPAIGN_FORM_ERROR_DETAILS] ${error.name}: ${error.message}`);
    console.error(`[CAMPAIGN_FORM_ERROR_STACK] ${error.stack}`);
  } else if (typeof error === "object" && error !== null) {
    console.error("[CAMPAIGN_FORM_ERROR_OBJECT]", JSON.stringify(error, null, 2));
  }
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date>(new Date());

  // Log component initialization
  useEffect(() => {
    logInfo("NewCampaignPage component initialized", {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      isVercel: typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'),
    });
  }, []);

  const form = useForm<Omit<Campaign, "id">>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      brand: {
        name: "",
        link: "",
        logo: {
          id: 0,
          url: "",
          alt: "",
          type: "hero",
        },
      },
      description: "",
      image: {
        id: 0,
        url: "",
        alt: "",
        type: "hero",
      },
      images: [],
      date: new Date(),
    },
  });

  useEffect(() => {
    if (date) {
      logInfo("Date changed", { newDate: date.toISOString() });
      form.setValue("date", date);
    }
  }, [date, form]);

  const onSubmit = async (data: Omit<Campaign, "id">) => {
    logInfo("Form submission started", {
      brandName: data.brand.name,
      hasLogo: !!data.brand.logo?.url,
      hasMainImage: !!data.image?.url,
      additionalImagesCount: data.images?.length,
    });

    try {
      // Validate required fields
      if (!data.brand.name) {
        logError("Validation error: Brand name is required", null);
        form.setError("brand.name", { message: "Brand name is required" });
        return;
      }

      if (!data.brand.logo?.url) {
        logError("Validation error: Brand logo is required", null);
        form.setError("brand.logo", { message: "Brand logo is required" });
        return;
      }

      if (!data.image?.url) {
        logError("Validation error: Main image is required", null);
        form.setError("image", { message: "Main image is required" });
        return;
      }

      // Format Instagram username if needed
      const username = data.brand.link;
      if (username && !username.startsWith("https://www.instagram.com/")) {
        data.brand.link = "https://www.instagram.com/" + username;
      }
      
      logInfo("Submitting campaign data to server", {
        brandName: data.brand.name,
        formattedLink: data.brand.link,
        logoDataLength: data.brand.logo.url ? (data.brand.logo.url as string).length : 0,
        mainImageDataLength: data.image.url ? (data.image.url as string).length : 0,
        additionalImagesCount: data.images?.length || 0
      });

      // Create campaign
      const result = await createCampaign(data);
      
      logInfo("Campaign created successfully", { 
        campaignId: result.id,
        timestamp: new Date().toISOString() 
      });
      
      router.push("/campaigns");
    } catch (error) {
      logError("Error creating campaign", error);
      
      // Try to extract more detailed error information
      let errorMessage = "Error creating campaign";
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Log additional details about the form state
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
    }
  };

  const handleAddImage = () => {
    logInfo("Adding additional image initiated");
    
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        logInfo("File selected for additional image", {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });
        
        const reader = new FileReader();
        reader.onload = () => {
          logInfo("File read completed for additional image");
          
          const newImage: ImageType = {
            id: Date.now(),
            url: reader.result as string,
            alt: file.name,
            type: "carousel",
          };
          
          const currentImages = form.getValues("images");
          form.setValue("images", [...currentImages, newImage]);
          
          logInfo("Additional image added to form", {
            imageId: newImage.id,
            totalImagesCount: currentImages.length + 1,
          });
        };
        
        reader.onerror = (error) => {
          logError("Error reading file for additional image", error);
        };
        
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
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
                        logInfo("Brand logo file selected", {
                          fileName: file.name,
                          fileType: file.type,
                          fileSize: file.size,
                        });
                        
                        const reader = new FileReader();
                        reader.onload = () => {
                          logInfo("Brand logo file read completed");
                          form.setValue("brand.logo", {
                            id: Date.now(),
                            url: reader.result as string,
                            alt: file.name,
                            type: "hero",
                          });
                        };
                        
                        reader.onerror = (error) => {
                          logError("Error reading brand logo file", error);
                        };
                        
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
                {form.watch("brand.logo.url") && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={form.watch("brand.logo.url")} alt="Brand Logo" layout="fill" objectFit="cover" className="rounded-lg" />
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
                  <Input placeholder="@username" {...field} />
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
                  <Textarea placeholder="Ingrese la descripción" {...field} />
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
                        logInfo("Main image file selected", {
                          fileName: file.name,
                          fileType: file.type,
                          fileSize: file.size,
                        });
                        
                        const reader = new FileReader();
                        reader.onload = () => {
                          logInfo("Main image file read completed");
                          form.setValue("image", {
                            id: Date.now(),
                            url: reader.result as string,
                            alt: form.getValues("description") || file.name,
                            type: "hero",
                          });
                        };
                        
                        reader.onerror = (error) => {
                          logError("Error reading main image file", error);
                        };
                        
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
                {form.watch("image.url") && (
                  <div className="mt-4 w-full">
                    <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                    <div className="relative w-full max-w-lg min-h-96 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={form.watch("image.url")} alt="Preview" layout="fill" objectFit="cover" />
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Imágenes Adicionales</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {form.watch("images").map((image, index) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <Image src={image.url} alt={image.alt} layout="fill" objectFit="cover" className="rounded-lg" />
                  </div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      logInfo("Removing additional image", { imageIndex: index, imageId: image.id });
                      const currentImages = form.getValues("images");
                      form.setValue(
                        "images",
                        currentImages.filter((_, i) => i !== index)
                      );
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
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {form.formState.errors.root && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              {form.formState.errors.root.message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creando..." : "Crear Campaña"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
