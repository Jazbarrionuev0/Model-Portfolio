import { getProfileAction } from "@/actions/profile";
import ProfileView from "@/components/admin/profile/profile-view";
import { Button } from "@/components/ui/button";
import { Edit3, User } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const profile = await getProfileAction();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm mx-auto text-center sm:shadow-2xl sm:rounded-2xl sm:p-8 sm:max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:w-20 sm:h-20 sm:mb-6">
            <User className="w-8 h-8 text-white sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-3 sm:text-2xl sm:mb-4">Perfil no encontrado</h1>
          <p className="text-gray-600 mb-5 text-sm sm:text-base sm:mb-6">Crea tu perfil para comenzar.</p>
          <Link href="/profile/edit">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm w-full sm:px-6 sm:py-3 sm:rounded-xl sm:shadow-lg sm:hover:shadow-xl sm:w-auto">
              Crear Perfil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4 sm:py-6 lg:max-w-4xl lg:mx-auto">
          <div className="space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 sm:gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent sm:text-3xl">
                Mi Perfil
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Gestiona tu información personal</p>
            </div>
            <Link href="/profile/edit">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm w-full sm:w-auto sm:px-6 sm:py-3 sm:rounded-xl sm:shadow-lg sm:hover:shadow-xl">
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                Editar Perfil
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 py-6 sm:p-6 sm:py-8 lg:py-12 lg:max-w-4xl lg:mx-auto">
        <ProfileView profile={profile} />
      </div>
    </div>
  );
}
