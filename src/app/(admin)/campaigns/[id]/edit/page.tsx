"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getCampaign, updateCampaign } from "@/app/actions/campaigns";
import { createCampaignSchema } from "@/schemas/campaign.schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageType } from "@/types/image";
import { type z } from "zod";
import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

type FormData = z.infer<typeof createCampaignSchema>;

const EditCampaignPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      brand: {
        name: "",
        logo: {
          id: Date.now(),
          url: undefined,
          alt: "",
          type: "hero",
        },
        link: "",
      },
      description: "",
      image: {
        id: Date.now(),
        url: "",
        alt: "",
        type: "hero",
      },
      images: [] as ImageType[],
      date: new Date(),
    },
  });

  // Load campaign data
  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setIsLoading(true);
        const id = (await params).id;
        const campaign = await getCampaign(id);

        if (campaign) {
          // Extract the Instagram username from the link
          let instagramUsername = campaign.brand.link;
          if (instagramUsername.startsWith("https://www.instagram.com/")) {
            instagramUsername = instagramUsername.replace("https://www.instagram.com/", "");
          }

          form.reset({
            ...campaign,
            brand: {
              ...campaign.brand,
              link: instagramUsername,
            },
            date: new Date(campaign.date),
          });
        } else {
          setLoadError("Campaña no encontrada");
        }
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Error al cargar la campaña");
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [form, params]);

  const onSubmit = async (data: FormData) => {
    try {
      const id = (await params).id;

      const username = data.brand.link;
      data.brand.link = "https://www.instagram.com/" + username;
      await updateCampaign(id, data);
      router.push("/campaigns");
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Error al actualizar la campaña",
      });
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
            type: "carousel",
          };
          const currentImages = form.getValues("images");
          form.setValue("images", [...currentImages, newImage]);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Cargando campaña...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-700 font-medium text-lg mb-2">Error</p>
          <p className="text-red-600">{loadError}</p>
          <Button className="mt-4" onClick={() => router.push("/campaigns")}>
            Volver a campañas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Actualizando..." : "Actualizar Campaña"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditCampaignPage;
