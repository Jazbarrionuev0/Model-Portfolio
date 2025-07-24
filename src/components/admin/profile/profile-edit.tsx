"use client";
import { Profile } from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateProfileAction } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { profileFormSchema, ProfileFormValues } from "@/schemas/campaign.schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Briefcase, Instagram, FileText, Save, Loader2 } from "lucide-react";

interface ProfileEditProps {
  profile: Profile;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ profile }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);

    try {
      toast({
        title: "Guardando cambios...",
        description: "Actualizando tu perfil.",
      });

      await updateProfileAction(data as Profile);

      toast({
        title: "¡Perfil actualizado!",
        description: "Los cambios se han guardado correctamente.",
        variant: "default",
      });

      router.push("/profile");
    } catch (error) {
      console.info(error);

      toast({
        title: "Error",
        description: "Hubo un problema al actualizar tu perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-6 sm:px-8 sm:py-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20 shadow-xl sm:w-24 sm:h-24 sm:border-3">
            <User className="w-10 h-10 text-white sm:w-12 sm:h-12" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 sm:text-3xl">Editar Perfil</h1>
          <p className="text-white/90 text-sm sm:text-base">Actualiza tu información personal</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <User className="w-4 h-4 text-indigo-600" />
                    Nombre completo
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa tu nombre completo"
                      {...field}
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Occupation Field */}
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    Ocupación
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Modelo, Fotógrafa, Artista"
                      {...field}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <Mail className="w-4 h-4 text-green-600" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="tu@email.com"
                      type="email"
                      {...field}
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Instagram Field */}
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    Instagram
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">@</span>
                      <Input
                        placeholder="tu_usuario"
                        {...field}
                        className="pl-8 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-lg"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Descripción
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cuéntanos sobre ti, tu experiencia y lo que te apasiona..."
                      className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Guardando cambios...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    <span>Guardar cambios</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileEdit;
