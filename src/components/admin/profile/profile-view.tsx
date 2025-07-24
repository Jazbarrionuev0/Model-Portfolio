import { Profile } from "@/types/profile";
import { User, Mail, Briefcase, Instagram, Info } from "lucide-react";

interface ProfileViewProps {
  profile: Profile;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden max-w-2xl mx-auto">
      {/* Header Section with Gradient Background */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col items-center text-center space-y-4 sm:flex-row sm:items-center sm:text-left sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 shadow-xl sm:w-24 sm:h-24 sm:border-3">
              <User className="w-10 h-10 text-white sm:w-12 sm:h-12" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white mb-3 sm:text-3xl">{profile.name}</h1>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 text-white/90 sm:justify-start">
                <Briefcase className="w-4 h-4 flex-shrink-0 sm:w-5 sm:h-5" />
                <span className="text-base font-medium sm:text-lg">{profile.occupation}</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-white/90 sm:justify-start">
                <Mail className="w-4 h-4 flex-shrink-0 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base truncate">{profile.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-8">
        {/* Instagram Link */}
        {profile.instagram && (
          <div className="flex justify-center">
            <a
              href={`https://instagram.com/${profile.instagram}`}
              className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-xl hover:from-pink-600 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-lg font-semibold">@{profile.instagram}</span>
            </a>
          </div>
        )}

        {/* Description */}
        {profile.description && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Acerca de mí</h2>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-6 border-l-4 border-indigo-500">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{profile.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
