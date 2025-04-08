"use client";

import { Button } from "@/components/ui/button";
import { Campaign } from "@/types/campaign";
import { CreateCampaignSchema, createCampaignSchema } from "@/schemas/campaign.schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Image as ImageType } from "@/types/image";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { updateCampaignAction } from "@/actions/campaign";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

const EditCampaignForm = ({ campaign }: { campaign: Campaign }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateCampaignSchema>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      ...campaign,
      date: new Date(campaign.date),
    },
  });

  const onSubmit = async (data: CreateCampaignSchema) => {
    try {
      setIsLoading(true);
      const username = data.brand.link;
      if (username && !username.startsWith("https://www.instagram.com/")) {
        data.brand.link = "https://www.instagram.com/" + username;
      }

      await updateCampaignAction({ ...data, id: campaign.id });
      router.push("/campaigns");
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Error al actualizar la campaña",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const newImage: ImageType = {
            id: Date.now(),
            url: reader.result as string,
            alt: file.name,
          };
          const currentImages = form.getValues("images");
          form.setValue("images", [...currentImages, newImage]);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Editar Campaña</h1>

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
                        const reader = new FileReader();
                        reader.onload = () => {
                          form.setValue("brand.logo.url", reader.result as string);
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
                <FormLabel>Nombre de la cuenta de Instagram de la Marca</FormLabel>
                <FormControl>
                  <Input placeholder="nombre_de_la_cuenta" {...field} />
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
                  <Textarea placeholder="Descripción de la campaña..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image.url"
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
                        const reader = new FileReader();
                        reader.onload = () => {
                          form.setValue("image", {
                            ...form.getValues("image"),
                            url: reader.result as string,
                            alt: form.getValues("description") || file.name,
                          });
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

              {/* Add Image Button */}
              <button
                type="button"
                onClick={handleAddImage}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <PlusCircle className="h-8 w-8 text-gray-400" />
              </button>

              {/* Empty placeholder slots */}
              {[...Array(Math.max(0, 3 - form.watch("images").length))].map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50" />
              ))}
            </div>
          </div>

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : ""}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{form.formState.errors.root.message}</div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={() => router.push("/campaigns")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Actualizando..." : "Actualizar Campaña"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditCampaignForm;
